import { useState, Dispatch, SetStateAction, useEffect, useRef } from "react"
import {
  Button,
  MessageBlock,
  AddProductFormPrice,
  AddProductFormGeneral,
  AddProductFormPurchases,
  AddProductFormPreview
} from "@components/ui"
import { Message } from "@utils/handleMessage"
import { LogDescription } from "ethers/lib/utils"
import { NewImage } from "pages/slicer/[id]"
import { useAppContext } from "../context"
import { ProductParamsStruct } from "types/typechain/ProductsModule"
import { ethers } from "ethers"
import AddProductFormExternal from "../AddProductFormExternal"
import ethToWei from "@utils/ethToWei"
import { useAddRecentTransaction } from "@rainbow-me/rainbowkit"
import { useSigner } from "wagmi"
import saEvent from "@utils/saEvent"
import { emptyExternalCall, Params } from "@components/hooks/purchaseHooks"
import openFingerprintingModal from "@utils/openFingerprintingModal"
import { ReducedShortcode } from "@utils/useDecodeShortcode"

type Props = {
  slicerId: number
  uploadStep: number
  setUploadStep: Dispatch<SetStateAction<number>>
  setUploadPct: Dispatch<SetStateAction<number>>
  setSuccess: Dispatch<SetStateAction<boolean>>
  setLogs: Dispatch<SetStateAction<LogDescription[]>>
  setCloneAddress: Dispatch<SetStateAction<string>>
}

const AddProductForm = ({
  slicerId,
  uploadStep,
  setUploadStep,
  setUploadPct,
  setSuccess,
  setLogs,
  setCloneAddress
}: Props) => {
  const { account, setModalView } = useAppContext()
  const { data: signer } = useSigner()
  const addRecentTransaction = useAddRecentTransaction()
  const [usdValue, setUsdValue] = useState(0)
  const [ethValue, setEthValue] = useState(0)
  const [name, setName] = useState("")
  const [shortDescription, setShortDescription] = useState("")
  const [description, setDescription] = useState("")
  const [newImage, setNewImage] = useState<NewImage>({
    url: "",
    file: undefined
  })
  const [isUSD, setIsUSD] = useState(false)
  const [isMultiple, setIsMultiple] = useState(false)
  const [isLimited, setIsLimited] = useState(false)
  const [isFree, setIsFree] = useState(false)
  const [units, setUnits] = useState(0)
  const [maxUnits, setMaxUnits] = useState(1)

  const [customShortcodes, setCustomShortcodes] = useState<ReducedShortcode>({})
  const [purchaseHookParams, setPurchaseHookParams] = useState<Params>({
    externalCall: emptyExternalCall
  })
  const [thankMessage, setThankMessage] = useState("")
  const [instructions, setInstructions] = useState("")
  const [notes, setNotes] = useState("")
  const [files, setFiles] = useState<File[]>([])
  const [message, setMessage] = useState<Message>({
    message: "",
    messageStatus: "success"
  })
  const submitEl = useRef(null)

  const externalCall = purchaseHookParams.externalCall

  const submit = async (e: React.SyntheticEvent<EventTarget>) => {
    e.preventDefault()

    saEvent("create_product_attempt")
    const { beforeCreate, handleReject, handleSuccess } = await import(
      "@lib/handleCreateProduct"
    )
    const { AddProduct, clone } = await import("@lib/handlers/chain")
    const handleSubmit = (await import("@utils/handleSubmit")).default

    const chainId = process.env.NEXT_PUBLIC_CHAIN_ID

    const filteredShortcodes = Object.entries(customShortcodes).filter(
      (shortcode) => {
        const [, val] = shortcode
        return val.length != 0
      }
    )

    try {
      const { image, newProduct, data, purchaseDataCID, purchaseData } =
        await beforeCreate(
          account,
          slicerId,
          name,
          shortDescription,
          description,
          purchaseHookParams,
          newImage,
          files,
          thankMessage,
          instructions,
          notes,
          filteredShortcodes,
          setUploadStep,
          setUploadPct
        )

      if (purchaseHookParams?.deploy != undefined) {
        const { factoryAddresses, abi, args } = purchaseHookParams.deploy
        const deployParams = { slicerId, args }
        const [hookAddress, , call] = await clone(
          factoryAddresses[chainId],
          abi,
          signer,
          deployParams
        )
        addRecentTransaction({
          hash: call.hash,
          description: "Deploy purchase hook"
        })
        if (hookAddress) {
          externalCall.externalAddress = hookAddress
          setCloneAddress(hookAddress)
        } else {
          saEvent("create_product_fail")
          setUploadStep(8)
          await handleReject(
            slicerId,
            image,
            data,
            purchaseDataCID,
            newProduct.id
          )
          setUploadStep(9)
          throw new Error("Transaction not successful")
        }
      }
      setUploadStep(7)
      // Create product on smart contract
      const weiValue = ethToWei(ethValue)
      const productPrice = isUSD ? Math.floor(usdValue * 100) : weiValue
      const currencyPrices =
        productPrice != 0
          ? [
              {
                currency: ethers.constants.AddressZero,
                value: productPrice,
                dynamicPricing: isUSD
              }
            ]
          : []
      const productParams: ProductParamsStruct = {
        subSlicerProducts: [],
        currencyPrices,
        data,
        purchaseData,
        availableUnits: units,
        isFree,
        maxUnitsPerBuyer: maxUnits,
        isInfinite: !isLimited
      }
      const eventLogs = await handleSubmit(
        AddProduct(signer, slicerId, productParams, externalCall),
        setMessage,
        null,
        null,
        true,
        addRecentTransaction,
        `Create product | Slicer #${slicerId}`
      )
      if (eventLogs) {
        saEvent("create_product_success")
        setLogs(eventLogs)
        setUploadStep(10)
        setTimeout(() => {
          setUploadStep(11)
        }, 3000)
        await handleSuccess(slicerId, newProduct.id, eventLogs)
        setSuccess(true)
        setModalView({ name: "" })
      } else {
        saEvent("create_product_fail")
        setUploadStep(8)
        await handleReject(
          slicerId,
          image,
          data,
          purchaseDataCID,
          newProduct.id
        )
        setUploadStep(9)
      }
    } catch (err) {
      setMessage({
        message: err.message,
        messageStatus: "error"
      })
      openFingerprintingModal(err, setModalView)
    }
  }

  useEffect(() => {
    setIsFree(ethValue != 0 ? false : true)
  }, [ethValue, usdValue])

  useEffect(() => {
    setMaxUnits(isMultiple ? 0 : 1)
  }, [isMultiple])

  return (
    <form className="w-full py-6 mx-auto space-y-6" onSubmit={submit}>
      <p>
        Products can be used to sell any physical or digital item, or to execute
        custom on-chain logic upon purchase (such as minting an NFT).
      </p>
      <p>Create one by setting up the info below.</p>
      <div>
        <hr className="w-20 mx-auto border-gray-300 my-14" />
      </div>
      <AddProductFormGeneral
        slicerId={slicerId}
        newImage={newImage}
        setNewImage={setNewImage}
        name={name}
        shortDescription={shortDescription}
        description={description}
        setName={setName}
        setDescription={setDescription}
        setShortDescription={setShortDescription}
      />
      <AddProductFormPrice
        isMultiple={isMultiple}
        isLimited={isLimited}
        isFree={isFree}
        units={units}
        maxUnits={maxUnits}
        ethValue={ethValue}
        usdValue={usdValue}
        isUSD={isUSD}
        setIsMultiple={setIsMultiple}
        setIsLimited={setIsLimited}
        setUnits={setUnits}
        setMaxUnits={setMaxUnits}
        setEthValue={setEthValue}
        setUsdValue={setUsdValue}
        setIsUSD={setIsUSD}
      />
      <AddProductFormExternal
        params={purchaseHookParams}
        setParams={setPurchaseHookParams}
      />
      <AddProductFormPurchases
        slicerId={slicerId}
        thankMessage={thankMessage}
        setThankMessage={setThankMessage}
        instructions={instructions}
        setInstructions={setInstructions}
        notes={notes}
        setNotes={setNotes}
        files={files}
        setFiles={setFiles}
        customShortcodes={customShortcodes}
        setCustomShortcodes={setCustomShortcodes}
      />
      <AddProductFormPreview
        slicerId={slicerId}
        name={name}
        shortDescription={shortDescription}
        description={description}
        newImage={newImage}
        maxUnits={Number(maxUnits)}
        isLimited={isLimited}
        units={units}
        ethValue={ethValue}
        usdValue={usdValue}
        isUSD={isUSD}
        thankMessage={thankMessage}
        instructions={instructions}
        notes={notes}
        files={files}
        setModalView={setModalView}
        externalCallValue={externalCall?.value}
        extAddress={externalCall?.externalAddress}
        extCheckSig={externalCall?.checkFunctionSignature}
        extExecSig={externalCall?.execFunctionSignature}
      />
      <div className="pb-1">
        <Button
          label="Create product"
          type="button"
          onClick={() =>
            setModalView({
              cross: true,
              name: "CREATE_PRODUCT_CONFIRM_VIEW",
              params: { submitEl, uploadStep, setModalView }
            })
          }
        />
        <button className="hidden" ref={submitEl} type="submit" />
      </div>
      <div>
        <MessageBlock msg={message} />
      </div>
    </form>
  )
}

export default AddProductForm

// Todo: What else to add to data and purchaseData (on pinata and web3storage)
// tags?
