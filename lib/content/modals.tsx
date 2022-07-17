import ShoppingBag from "@components/icons/ShoppingBag"
import Units from "@components/icons/Units"
import {
  Button,
  CardImage,
  CartButton,
  DoubleText,
  FilesList,
  LoadingStep,
  MarkdownBlock,
  OwnerBlock
} from "@components/ui"
import { useAppContext } from "@components/ui/context"
import { ProductCart } from "@lib/handleUpdateCart"
import getEthFromWei from "@utils/getEthFromWei"
import formatNumber from "@utils/formatNumber"
import { useCookies } from "react-cookie"
import { ethers } from "ethers"
import getFunctionFromSelector from "@utils/getFunctionFromSelector"
import { useEffect, useState } from "react"
import { ConnectButton } from "@rainbow-me/rainbowkit"
import saEvent from "@utils/saEvent"
import Share from "@components/icons/Share"
import { domain } from "@components/common/Head"
import copyText from "@utils/copyText"

export type View = {
  name: ViewNames
  cross?: boolean
  params?: object
}
type ViewNames =
  | ""
  | "LOADING_VIEW"
  | "NETWORK_VIEW"
  | "CONNECT_VIEW"
  | "IRREVERSIBLE_VIEW"
  | "OWNERS_VIEW"
  | "CREATE_PRODUCT_VIEW"
  | "CREATE_PRODUCT_CONFIRM_VIEW"
  | "PRODUCT_VIEW"
  | "REDEEM_PRODUCT_VIEW"
  | "FINGERPRINTING_VIEW"

export const LOADING_VIEW = () => {
  return (
    <>
      <div className="pb-6 text-center">
        <DoubleText inactive logoText="Loading..." />
      </div>
      <p className="text-lg text-center">🍰 Please wait 🍰</p>
    </>
  )
}

export const NETWORK_VIEW = () => {
  const chainId = process.env.NEXT_PUBLIC_CHAIN_ID

  return (
    <>
      <div className="pb-6 text-center">
        <DoubleText inactive logoText="Pick the right chain" />
      </div>
      <p className="text-lg text-center">
        Connect to the{" "}
        <span className="font-black">
          {chainId === "4" ? "Rinkeby" : "Ethereum Mainnet"}
        </span>{" "}
        Network
      </p>
      <div
        className="flex justify-center pt-6"
        onClick={() => saEvent("connect_wallet_attempt")}
      >
        <ConnectButton
          accountStatus={{
            smallScreen: "address",
            largeScreen: "full"
          }}
          chainStatus="full"
          showBalance={false}
        />
      </div>
    </>
  )
}

export const CONNECT_VIEW = () => {
  const { account, setModalView } = useAppContext()
  useEffect(() => {
    saEvent("connect_wallet_open_modal")
  }, [])

  useEffect(() => {
    if (account) {
      saEvent("connect_wallet_success")
      setModalView({ name: "" })
    }
  }, [account])

  return (
    <>
      <div className="pb-6 text-center">
        <DoubleText inactive logoText="Before moving on" />
      </div>
      <div className="text-center">
        <p className="pb-6">
          You need to connect your wallet to complete this action
        </p>
      </div>
      <div
        className="flex justify-center"
        onClick={() => saEvent("connect_wallet_attempt")}
      >
        <ConnectButton />
      </div>
    </>
  )
}

export const IRREVERSIBLE_VIEW = () => {
  const { setModalView } = useAppContext()
  return (
    <>
      <div className="pb-6 text-center">
        <DoubleText inactive logoText="Be careful" />
      </div>
      <div className="text-center">
        <p className="pb-4">
          You won&apos;t be able to change the name, description and image of
          your slicer a second time.
        </p>
        <p className="font-bold text-yellow-600">
          Make sure the slicer details and image are correct
        </p>
      </div>
      <div className="flex justify-center pt-8">
        <Button label="Continue" onClick={() => setModalView({ name: "" })} />
      </div>
    </>
  )
}

export const OWNERS_VIEW = (params: any) => {
  const { slicerId, totalSlices, owners, unreleased, setUnreleased } = params

  useEffect(() => {
    saEvent("owners_open_modal")
  }, [])

  return (
    <>
      <div className="pb-6 text-center">
        <DoubleText inactive logoText="Slicer owners" />
        <p className="pt-4">{formatNumber(totalSlices)} Total slices 🍰</p>
      </div>
      <ul className="max-w-sm pt-6 mx-auto">
        {owners.map((el, key) => (
          <li key={key}>
            <OwnerBlock
              index={Number(key)}
              slicerId={slicerId}
              totalSlices={totalSlices}
              owner={owners[Number(key)]}
              unreleasedOwner={unreleased[Number(key)]}
              unreleased={unreleased}
              setUnreleased={setUnreleased}
            />
            {key != owners.length - 1 && (
              <hr className="my-8 border-gray-300" />
            )}
          </li>
        ))}
      </ul>
    </>
  )
}

export const CREATE_PRODUCT_CONFIRM_VIEW = (params: any) => {
  const { submitEl, uploadStep, setModalView } = params
  const handleClick = () => {
    submitEl.current.click()
    if (uploadStep == 0) {
      setModalView({ name: "" })
    }
  }
  return (
    <>
      <div className="pb-6 text-center">
        <DoubleText inactive logoText="Ready to create product?" />
        <p className="pt-8">
          Make sure the information added is correct, you won&apos;t be able to
          change all details later.
        </p>
      </div>

      <div className="text-center">
        <Button label="Go ahead!" onClick={() => handleClick()} />
      </div>
      <div className="flex justify-center pt-8">
        <p
          className="font-medium text-red-500 cursor-pointer hover:underline"
          onClick={() => setModalView({ name: "" })}
        >
          Go back
        </p>
      </div>
    </>
  )
}

export const CREATE_PRODUCT_VIEW = (params: any) => {
  const { uploadStep, uploadPct, setModalView, cloneAddress } = params
  const processing = uploadStep !== 9

  let uploadState: string
  switch (uploadStep) {
    case 1:
      uploadState = "Uploading image"
      break
    case 2:
      uploadState = "Saving metadata"
      break
    case 3:
      uploadState = "Encrypting files"
      break
    case 4:
      uploadState = `Uploading files: ${uploadPct < 100 ? uploadPct : 100}%`
      break
    case 5:
      uploadState = "Finishing setting up"
      break
    case 6:
      uploadState = "Deploying purchase hook ..."
      break
    case 7:
      uploadState = "Transaction in progress ..."
      break
    case 8:
      uploadState = "Reverting"
      break
    case 9:
      uploadState = "Done, reverted!"
      break
    case 10:
      uploadState = "Finalizing"
      break
    case 11:
      uploadState = "Almost done"
      break
  }
  return (
    <div className="text-center">
      <div className="pb-6 text-center">
        <DoubleText inactive logoText="Creating product" />
      </div>
      <p className="pb-8">Please wait until the process is completed</p>
      <div className="grid items-center grid-cols-6 gap-2 px-4">
        <LoadingStep
          initCondition={uploadStep < 3}
          uploadState={uploadState}
          endState="Done"
        />
        <LoadingStep
          nullCondition={uploadStep < 3}
          initCondition={uploadStep < 7}
          uploadState={uploadState}
          waitingState="File upload"
          endState={
            cloneAddress ? (
              <>
                Hook deployed!{" "}
                <a
                  href={`https://${
                    process.env.NEXT_PUBLIC_CHAIN_ID === "4" ? "rinkeby." : ""
                  }etherscan.io/address/${cloneAddress}`}
                  target="_blank"
                  rel="noreferrer"
                  className="highlight"
                >
                  See on Etherscan
                </a>
              </>
            ) : (
              "Done"
            )
          }
        />
        <LoadingStep
          nullCondition={uploadStep < 7}
          initCondition={processing}
          uploadState={uploadState}
          waitingState="Blockchain interaction"
        />
      </div>
      <div className="pt-10">
        {uploadStep === 9 ? (
          <Button
            label={"Go back to product"}
            onClick={() => setModalView({ name: "" })}
          />
        ) : (
          <p className="max-w-sm mx-auto text-sm">
            To make the product immediately appear on the website{" "}
            <b className="text-yellow-600">
              do not leave this page until the process has completed
            </b>
          </p>
        )}
      </div>
    </div>
  )
}

export const PRODUCT_VIEW = (params: any) => {
  const [cookies] = useCookies(["cart"])
  const {
    slicerId,
    productId,
    name,
    shortDescription,
    description,
    image,
    productPrice,
    isUSD,
    extAddress,
    extValue,
    extCheckSig,
    extExecSig,
    isInfinite,
    maxUnits,
    uid,
    creator,
    texts,
    allowedAddresses,
    availableUnits,
    totalPurchases,
    purchaseInfo,
    slicerAddress,
    price,
    editMode,
    purchasedQuantity,
    availabilityColor,
    preview
  } = params

  const [isCopied, setIsCopied] = useState(false)
  const cookieCart: ProductCart[] = cookies?.cart
  const productCart: ProductCart = cookieCart?.find(
    (product) =>
      product.slicerAddress == slicerAddress && product.productId == productId
  )
  const purchaseElArray = Object.keys(purchaseInfo).filter(
    (el) => purchaseInfo[el] == true
  )
  const purchaseEl = purchaseElArray.join(", ")

  useEffect(() => {
    saEvent("product_view_open_modal")
  }, [])

  return (
    <>
      <div
        className="absolute top-[24px] left-[24px] hover:text-blue-600 flex cursor-pointer items-center text-gray-700"
        onClick={async () =>
          await copyText(
            `${domain}/slicer/${slicerId}?product=${productId}`,
            setIsCopied
          )
        }
      >
        <Share />
        <p className="pt-0.5 pl-2 text-sm font-semibold">
          {isCopied ? "Link copied! 🍰" : "Share"}
        </p>
      </div>
      <div className="pt-4 pb-12 text-center sm:pb-16">
        <DoubleText inactive logoText={name} size="text-3xl sm:text-4xl" />
        {shortDescription && (
          <p className="max-w-sm pt-6 mx-auto text-gray-500">
            {shortDescription}
          </p>
        )}
      </div>
      <div>
        <CardImage
          name={name}
          imageUrl={image}
          size="h-52 xs:h-72"
          disableHover
          product
          topLeft={{
            title: "Purchases",
            content: (
              <>
                <p className="mr-2 text-indigo-600">
                  {formatNumber(totalPurchases)}
                </p>
                <ShoppingBag className="w-[18px] h-[18px] text-indigo-600" />
              </>
            )
          }}
          topRight={{
            title: "Product price",
            content: (
              <p className="text-sm font-medium text-black">
                {productPrice.usd}
              </p>
            )
          }}
          bottomLeft={
            !isInfinite && {
              title: "Available units",
              content: (
                <>
                  <p className={`mr-2 ${availabilityColor}`}>
                    {formatNumber(availableUnits)}
                  </p>
                  <Units className={`w-[18px] h-[18px] ${availabilityColor}`} />
                </>
              )
            }
          }
        />
        <div className="py-8">
          <div>
            <MarkdownBlock content={description} />
          </div>
        </div>
        {extAddress && !editMode && (
          <div className="mx-auto cursor-pointer w-60">
            <CartButton
              slicerId={slicerId}
              productCart={productCart}
              slicerAddress={slicerAddress}
              productId={productId}
              price={price}
              isUSD={isUSD}
              extAddress={extAddress}
              extCallValue={extValue}
              extCheckSig={extCheckSig}
              name={name}
              image={image}
              maxUnits={Number(maxUnits)}
              availableUnits={isInfinite ? -1 : availableUnits}
              purchasedQuantity={purchasedQuantity}
              uid={uid}
              creator={creator}
              texts={texts}
              allowedAddresses={allowedAddresses}
              labelAdd={`Get it for ${productPrice.eth}`}
              labelRemove={productPrice.eth}
              preview={preview}
            />
          </div>
        )}
        {!editMode &&
          productPrice.eth != "free" &&
          Number(maxUnits) != 1 &&
          productCart?.quantity && (
            <p className="pt-4 text-sm text-center ">
              {`Ξ ${
                Math.floor(
                  Number(productPrice.eth.substring(1)) *
                    productCart?.quantity *
                    1000
                ) / 1000
              }`}
            </p>
          )}
        {extAddress &&
        extAddress != "0x00000000" &&
        extAddress != ethers.constants.AddressZero &&
        (extValue != "0" || extExecSig != "0x00000000") ? (
          <p className="pt-6 mx-auto text-sm text-center">
            Interacts with{" "}
            <a
              className="font-bold highlight"
              href={`https://${
                process.env.NEXT_PUBLIC_CHAIN_ID === "4" ? "rinkeby." : ""
              }etherscan.io/address/${extAddress}`}
              target="_blank"
              rel="noreferrer"
            >
              {extAddress.replace(
                extAddress.substring(5, extAddress.length - 3),
                `\xa0\xa0\xa0\xa0\xa0\xa0`
              )}
            </a>{" "}
            by{" "}
            {extValue != "0" ? (
              <>
                sending <b>{getEthFromWei(extValue)}</b> ETH
              </>
            ) : (
              ""
            )}
            {extValue != "0" && extExecSig != "0x00000000" ? " and " : ""}
            {extExecSig != "0x00000000" ? (
              <>
                executing the function{" "}
                <b className="text-yellow-600">
                  {getFunctionFromSelector(extExecSig)}
                </b>
              </>
            ) : (
              ""
            )}
          </p>
        ) : null}
        {purchaseElArray && purchaseElArray.length != 0 ? (
          <p className="pt-6 text-sm text-center mx-auto max-w-[340px]">
            Contains <b>{purchaseEl}</b>
          </p>
        ) : null}
      </div>
    </>
  )
}

export const REDEEM_PRODUCT_VIEW = (params: any) => {
  const {
    slicerId,
    productId,
    name,
    image,
    purchasedQuantity,
    texts,
    decryptedFiles,
    decryptedTexts
  } = params

  const { thanks, instructions } = texts
  const { notes } = decryptedTexts

  useEffect(() => {
    saEvent("redeem_product_success")
  }, [])

  return (
    <>
      <div className="pt-4 pb-12 text-center sm:pb-16">
        <DoubleText inactive logoText={name} size="text-3xl sm:text-4xl" />
      </div>
      <div>
        <CardImage
          name={name}
          imageUrl={image}
          size="h-52 xs:h-72"
          product
          disableHover
        />
        {purchasedQuantity != 1 && (
          <p className="pt-6 text-sm text-center text-gray-500">
            You bought this product {purchasedQuantity} times
          </p>
        )}
        <div className="pb-6 pt-14">
          <div>
            <MarkdownBlock
              className="prose text-center"
              content={thanks || "Thank you for buying our product! ❤️"}
            />
          </div>
        </div>
        {instructions && (
          <div className="py-8">
            <h3 className="pb-4">Instructions</h3>
            <div>
              <MarkdownBlock content={instructions} />
            </div>
          </div>
        )}
        {notes && (
          <div className="py-8">
            <h3>Notes</h3>
            <div>
              <MarkdownBlock content={notes} />
            </div>
          </div>
        )}
        {decryptedFiles.length != 0 && (
          <div className="max-w-sm py-6 mx-auto text-center">
            <FilesList
              title="Download files"
              files={decryptedFiles}
              uploadable={false}
              backgroundColor="nightwind-prevent bg-blue-600 text-white"
              downloadable={true}
            />
          </div>
        )}
      </div>
    </>
  )
}

export const FINGERPRINTING_VIEW = () => {
  return (
    <>
      <div className="pb-6 text-center">
        <DoubleText inactive logoText="Oops, shield detected" />
      </div>
      <p className="text-center">
        Make sure Fingerprinting protection isn&apos;t enabled in your browser,
        if you are a Brave user turn off shields and try again.
      </p>
    </>
  )
}
// TODO: Do not decrypt thankMessage and instructions

// Todo: Add 'download all' button
