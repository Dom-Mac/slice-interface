import { Dispatch, SetStateAction } from "react"
import { NewImage } from "pages/slicer/[id]"
import { LogDescription } from "@ethersproject/abi"
import decimalToHex from "@utils/decimalToHex"
import timeout from "@utils/timeout"
import { StrategyParams } from "@components/priceStrategies/strategies"
import { ethers, Signer } from "ethers"
// import { mutate } from "swr"

export const beforeCreate = async (
  creator: string,
  slicerId: number,
  name: string,
  shortDescription: string,
  description: string,
  purchaseHookParams: { allowedAddresses?: string[] },
  newImage: NewImage,
  purchaseFiles: File[],
  thanks: string,
  instructions: string,
  notes: string,
  filteredShortcodes: [string, string[]][],
  setUploadStep: Dispatch<SetStateAction<number>>,
  setUploadPct: Dispatch<SetStateAction<number>>
) => {
  const { CID } = await import("multiformats/cid")
  const supabaseUpload = (await import("@utils/supabaseUpload")).default
  const fetcher = (await import("@utils/fetcher")).default
  const web3Storage = (await import("./web3Storage")).default
  const { encryptFiles, importKey } = await import("@utils/crypto")
  let purchaseDataCID: string
  let allowedAddresses = []

  const uid = Math.random().toString().substring(2)
  const purchaseInfo = {
    instructions: instructions.length != 0,
    notes: notes.length != 0,
    files: purchaseFiles.length != 0,
    shortcodes: filteredShortcodes.map((el) => el[0])
  }
  const metadata = {
    name,
    shortDescription,
    description,
    creator,
    uid,
    purchaseInfo,
    texts: {
      thanks,
      instructions
    }
  }

  if (
    purchaseHookParams?.allowedAddresses &&
    purchaseHookParams?.allowedAddresses?.length != 0
  ) {
    allowedAddresses = purchaseHookParams?.allowedAddresses
    allowedAddresses.forEach((address) => {
      if (!address.match(/^0x[a-f0-9]{40}$/)) {
        throw Error(`Allowlisted address ${address} is not valid`)
      }
    })
    metadata["allowedAddresses"] = allowedAddresses
  }

  // Save image on supabase
  let image = ""
  setUploadStep(1)
  if (newImage.url) {
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
    {
      const { Key } = await supabaseUpload(
        `${slicerId}/products/${name}`,
        newImage
      )
      image = `${supabaseUrl}/storage/v1/object/public/${Key}`
      metadata["image"] = image
    }
  }

  // Pin metadata on pinata
  setUploadStep(2)
  const pinMetadataBody = {
    body: JSON.stringify({
      metadata,
      slicerId
    }),
    method: "POST"
  }
  const { IpfsHash } = await fetcher("/api/pin_json", pinMetadataBody)
  const data = CID.parse(IpfsHash).bytes

  // encrypt files
  if (purchaseFiles.length != 0 || notes.length != 0) {
    setUploadStep(3)
    const texts = [{ value: notes, filename: "Notes" }]
    const keygenBody = {
      method: "POST",
      body: JSON.stringify({
        slicerId,
        name,
        creator,
        uid
      })
    }
    const { exportedKey, iv } = await fetcher("/api/keygen", keygenBody)
    const key = await importKey(exportedKey)
    const encryptedFiles = await encryptFiles(
      key,
      new Uint8Array(iv),
      purchaseFiles,
      texts
    )

    // save purchaseFiles on web3Storage
    setUploadStep(4)
    const { webStorageKey } = await fetcher("/api/webStorage")
    const totalSize = encryptedFiles
      .map((f) => f.size)
      .reduce((a, b) => a + b, 0)
    let uploaded = 0
    const onStoredChunk = (size: number) => {
      uploaded += size
      setUploadPct((uploaded * 100) / totalSize)
    }
    purchaseDataCID = await web3Storage(webStorageKey).put(encryptedFiles, {
      maxRetries: 3,
      onStoredChunk
    })
  }
  const purchaseData = purchaseDataCID ? CID.parse(purchaseDataCID).bytes : []

  // Save metadata, hashes & imageUrl on prisma
  setUploadStep(5)
  const body = {
    method: "POST",
    body: JSON.stringify({
      name,
      shortDescription,
      description,
      image,
      creator,
      uid,
      hash: IpfsHash,
      tempProductHash: purchaseDataCID,
      purchaseInfo,
      texts: {
        thanks,
        instructions
      },
      allowedAddresses,
      filteredShortcodes
    })
  }

  const { data: newProduct } = await fetcher(
    `/api/slicer/${slicerId}/products`,
    body
  )

  setUploadStep(6)
  return {
    image,
    newProduct,
    data,
    purchaseData,
    purchaseDataCID
  }
}

export const handleSuccess = async (
  signer: Signer,
  slicerId: number,
  id: string,
  eventLogs: LogDescription[],
  priceParams: StrategyParams,
  setUploadStep: Dispatch<SetStateAction<number>>
) => {
  const fetcher = (await import("@utils/fetcher")).default
  const getLog = (await import("@utils/getLog")).default

  const eventLog = getLog(eventLogs, "ProductAdded")
  const productId = Number(eventLog[1]._hex)

  // Update product in prisma, adding productId and removing productHash
  const putBody = {
    method: "PUT",
    body: JSON.stringify({
      id,
      productId,
      tempProductHash: null
    })
  }
  await fetcher(`/api/slicer/${slicerId}/products`, putBody)
  if (priceParams?.address && priceParams?.abi) {
    const launchConfetti = (await import("utils/launchConfetti")).default
    setUploadStep(8)
    const contract = new ethers.Contract(
      priceParams.address,
      priceParams.abi,
      signer
    )

    const tx = await contract.setProductPrice(
      slicerId,
      productId,
      ethers.constants.AddressZero,
      ...priceParams.args
    )
    await tx.wait()
    launchConfetti()
    setUploadStep(12)
  } else {
    await timeout(3500)
  }
  await fetcher(`/api/slicer/${slicerId}/refresh`)
}

export const handleReject = async (
  slicerId: number,
  image: string,
  dataHash: Uint8Array | string,
  purchaseDataCID: string,
  productId: string
) => {
  const { CID } = await import("multiformats/cid")
  const fetcher = (await import("@utils/fetcher")).default

  const supabaseStorage = process.env.NEXT_PUBLIC_SUPABASE_STORAGE_NAME
  // unpin
  if (dataHash) {
    let hash = dataHash
    if (typeof dataHash != "string") {
      hash = CID.decode(dataHash).toString()
    }
    const unpinBody = {
      body: JSON.stringify({ hash }),
      method: "POST"
    }
    await fetcher("/api/unpin", unpinBody)
  }

  // delete image from supabase
  if (image) {
    const currentImageName = image.split(`${supabaseStorage}/`).pop()
    const body = {
      method: "POST",
      body: JSON.stringify({
        url: currentImageName
      })
    }
    await fetcher(`/api/slicer/delete_file`, body)
  }

  // delete from prisma
  const body = {
    method: "DELETE"
  }
  await fetcher(`/api/slicer/${slicerId}/products?productId=${productId}`, body)

  // add web3Storage hash in Reject table on prisma
  if (purchaseDataCID) {
    const revertBody = {
      method: "POST",
      body: JSON.stringify({
        purchaseDataCID
      })
    }
    await fetcher(`/api/addRevert`, revertBody)
  }
}

export const handleCleanup = async (
  slicerId: number,
  setLoading: Dispatch<SetStateAction<boolean>>
) => {
  const { CID } = await import("multiformats/cid")
  const fetcher = (await import("@utils/fetcher")).default
  const { base16 } = await import("multiformats/bases/base16")
  const client = (await import("@utils/apollo-client")).default
  const { gql } = await import("@apollo/client")

  const hexId = decimalToHex(slicerId)

  setLoading(true)

  // Get all pending products and loop through them
  const { data: products } = await fetcher(
    `/api/slicer/${slicerId}/products?pending=true`
  )

  for (let i = 0; i < products.length; i++) {
    const product = products[i]
    const dataHash =
      "0x" + CID.parse(product.hash)?.toString(base16).substring(1)

    // // Distinguish between minted / not minted product
    const tokensQuery = /* GraphQL */ `
      products(where: {
        slicer: "${hexId}",
        creator: "${product.creator.toLowerCase()}",
        data: "${dataHash}"
      }) {
        id
      }
    `
    const { data } = await client.query({
      query: gql`
      query {
        ${tokensQuery}
      }
    `
    })

    if (data.products.length != 0 /* minted */) {
      // Update productId and remove hash
      const productId = data.products[0].id.split("-").pop()
      const putBody = {
        method: "PUT",
        body: JSON.stringify({
          id: product.id,
          productId: productId,
          tempProductHash: null
        })
      }
      await fetcher(`/api/slicer/${slicerId}/products`, putBody)
    } /* not minted */ else {
      await handleReject(
        slicerId,
        product.image,
        product.hash,
        product.tempProductHash,
        product.id
      )
    }
  }
  await reload(slicerId, setLoading)
}

export const reload = async (
  slicerId: number,
  setLoading: Dispatch<SetStateAction<boolean>>
) => {
  const { CID } = await import("multiformats/cid")
  const fetcher = (await import("@utils/fetcher")).default
  const { base16 } = await import("multiformats/bases/base16")
  const client = (await import("@utils/apollo-client")).default
  const { gql } = await import("@apollo/client")

  const hexId = decimalToHex(slicerId)
  setLoading(true)

  // Get all missing minted products on prisma
  const { data: products } = await fetcher(`/api/slicer/${slicerId}/products`)

  const tokensQuery = /* GraphQL */ `
  products (
    where: {
      slicer: "${hexId}" 
    }, 
    orderBy: "createdAtTimestamp", 
    orderDirection: "asc"
  ) {
    id
    data
    isRemoved
    createdAtTimestamp
  }
`
  const { data } = await client.query({
    query: gql`
      query {
        ${tokensQuery}
      }
    `
  })
  const blockchainProducts = data.products

  const timeHasElapsed = (timestamp: string) => {
    return Number(timestamp) < Math.floor(Date.now() / 1000) - 60 * 15
  }

  const productIds = blockchainProducts.map((product) =>
    Number(product.id.split("-")[1])
  )

  let productsToCreate = []

  for (let i = 0; i < productIds.length; i++) {
    const productId = productIds[i]

    if (products.filter((p) => p.productId === productId).length == 0) {
      if (timeHasElapsed(blockchainProducts[i].createdAtTimestamp)) {
        // If product hasn't been removed
        if (
          !blockchainProducts[i].isRemoved &&
          blockchainProducts[i].data != "0x"
        ) {
          const hash = "f" + blockchainProducts[i].data.substring(2)
          const dataHash = CID.parse(hash, base16.decoder).toV1().toString()

          const {
            name,
            shortDescription,
            description,
            creator,
            image,
            uid,
            purchaseInfo,
            texts
          } = await fetcher(`https://slice.mypinata.cloud/ipfs/${dataHash}`)

          productsToCreate.push({
            name,
            shortDescription,
            description,
            image,
            creator,
            uid: uid || "",
            tempProductHash: null,
            hash: dataHash,
            purchaseInfo,
            texts,
            slicerId,
            productId,
            isRemoved: false
          })
        } else {
          productsToCreate.push({
            name: `Product #${productId}`,
            shortDescription: "",
            description: "",
            image: "",
            creator: "",
            uid: "",
            tempProductHash: null,
            hash: "",
            purchaseInfo: {
              files: false,
              notes: false,
              shortcodes: false,
              instructions: false
            },
            texts: {
              thanks: "",
              instructions: ""
            },
            slicerId,
            productId,
            isRemoved: blockchainProducts[i].isRemoved
          })
        }
      }
    }
  }

  const body = JSON.stringify({ data: productsToCreate })

  if (body != "{}") {
    const payload = {
      method: "POST",
      body
    }

    await fetcher(`/api/createProducts`, payload)
  }

  // mutate(`/api/slicer/${slicerId}/products`)
  setLoading(false)
}

// TODO: Verify reload and cleanup work as intended
