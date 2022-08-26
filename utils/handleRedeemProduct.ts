import { Dispatch, SetStateAction } from "react"
import { View } from "@lib/content/modals"
import { Signer } from "ethers"
import saEvent from "./saEvent"

const handleRedeemProduct = async (
  account: string,
  signer: Signer,
  dbId: number,
  slicerId: number,
  productId: number,
  name: string,
  image: string,
  uid: string,
  creator: string,
  texts: {
    thanks?: string
    instructions?: string
  },
  setLoading: Dispatch<SetStateAction<boolean>>,
  setModalView: Dispatch<SetStateAction<View>>,
  shortcodes: string[]
) => {
  try {
    saEvent("redeem_product_attempt")
    const fetcher = (await import("@utils/fetcher")).default
    const { CID } = await import("multiformats/cid")
    const { base16 } = await import("multiformats/bases/base16")
    const redeemProduct = (await import("@lib/handlers/chain/redeemProduct"))
      .default
    const handleDecryptData = (await import("@lib/handleDecryptData")).default

    let decryptedFiles: File[] = []
    let decryptedTexts: {} = {}

    setLoading(true)

    // Check if product has been purchased
    const redeemed = await redeemProduct(signer, slicerId, productId)

    // Retrieve and decrypt purchaseInfo texts and files
    if (redeemed[1] != "0x") {
      const purchaseHash = CID.parse(
        "f" + redeemed[1].substring(2),
        base16.decoder
      )
        .toV1()
        .toString()
      const decrypted = await handleDecryptData(
        slicerId,
        name,
        creator,
        uid,
        purchaseHash
      )
      decryptedFiles = decrypted.decryptedFiles
      decryptedTexts = decrypted.decryptedTexts
    }

    // Retrieve or apply shortcodes, if present

    let accountCodes = {}
    if (shortcodes && shortcodes?.length != 0) {
      const { data } = await fetcher(
        `/api/account/${account}/shortcodes?productId=${dbId}&codes=${shortcodes.join(
          ","
        )}`
      )

      accountCodes = data?.appliedCodes
      shortcodes.forEach((shortcode) => {
        if (!accountCodes[`${shortcode}`]) {
          accountCodes[`${shortcode}`] = "___"
        }
      })
    }

    setModalView({
      name: "REDEEM_PRODUCT_VIEW",
      cross: true,
      params: {
        slicerId,
        productId,
        name,
        image,
        purchasedQuantity: Number(redeemed[0]),
        texts,
        decryptedFiles,
        decryptedTexts,
        accountCodes
      }
    })
  } catch (err) {
    saEvent("redeem_product_fail")
    console.log(err)
  }
  setLoading(false)
}

export default handleRedeemProduct
