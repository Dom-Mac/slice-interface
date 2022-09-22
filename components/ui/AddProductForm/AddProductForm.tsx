import { useState, Dispatch, SetStateAction, useEffect, useRef } from "react"
import {
  Button,
  MessageBlock,
  AddProductFormAvailability,
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
import { emptyExternalCall, HookParams } from "@components/hooks/purchaseHooks"
import openFingerprintingModal from "@utils/openFingerprintingModal"
import { ReducedShortcode } from "@utils/useDecodeShortcode"
import { deploy } from "@lib/handlers/chain"
import { StrategyParams } from "@components/priceStrategies/strategies"

type Props = {
  slicerId: number
  uploadStep: number
  setUploadStep: Dispatch<SetStateAction<number>>
  setUploadPct: Dispatch<SetStateAction<number>>
  setSuccess: Dispatch<SetStateAction<boolean>>
  setLogs: Dispatch<SetStateAction<LogDescription[]>>
  setCloneAddress: Dispatch<SetStateAction<string>>
  priceParams: StrategyParams
  setPriceParams: Dispatch<SetStateAction<StrategyParams>>
}

const AddProductForm = ({
  slicerId,
  uploadStep,
  setUploadStep,
  setUploadPct,
  setSuccess,
  setLogs,
  setCloneAddress,
  priceParams,
  setPriceParams
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
  const [purchaseHookParams, setPurchaseHookParams] = useState<HookParams>({
    externalCall: emptyExternalCall
  })
  const [clonePurchaseHook, setClonePurchaseHook] = useState(false)
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

    let image: string,
      newProduct: any,
      data: Uint8Array,
      purchaseDataCID: string,
      purchaseData: any[] | Uint8Array

    try {
      const productInfo = await beforeCreate(
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

      image = productInfo.image
      newProduct = productInfo.newProduct
      data = productInfo.data
      purchaseDataCID = productInfo.purchaseDataCID
      purchaseData = productInfo.purchaseData

      if (purchaseHookParams?.deploy != undefined) {
        let hookAddress: string
        let call: any

        const { deployments, abi, args } = purchaseHookParams.deploy
        const deployParams = { slicerId, args }
        if (clonePurchaseHook) {
          ;[hookAddress, , call] = await clone(
            deployments.cloner[chainId],
            abi.clonerInterface,
            signer,
            deployParams
          )
        } else {
          ;[hookAddress, , call] = await deploy(
            deployments.factory[chainId],
            abi.factoryInterface,
            signer,
            deployParams
          )
        }
        if (hookAddress) {
          addRecentTransaction({
            hash: call.hash,
            description: "Deploy purchase hook"
          })
          externalCall.externalAddress = hookAddress
          setCloneAddress(hookAddress)
        } else {
          throw new Error()
        }
      }
      setUploadStep(7)
      // Create product on smart contract
      const weiValue = ethToWei(ethValue)
      const productPrice = isUSD ? Math.floor(usdValue * 100) : weiValue
      const isStrategyConfigurable = priceParams?.abi != undefined
      const currencyPrices =
        productPrice != 0 || priceParams?.address
          ? [
              {
                currency: ethers.constants.AddressZero,
                value: productPrice,
                dynamicPricing: isUSD,
                externalAddress:
                  priceParams?.address || ethers.constants.AddressZero
              }
            ]
          : []

      const productParams: ProductParamsStruct = {
        isFree: priceParams?.address ? false : isFree,
        maxUnitsPerBuyer: maxUnits,
        isInfinite: !isLimited,
        availableUnits: units,
        data,
        purchaseData,
        subSlicerProducts: [],
        currencyPrices,
        isExternalCallPaymentRelative: false,
        isExternalCallPreferredToken: false
      }
      const eventLogs = await handleSubmit(
        AddProduct(signer, slicerId, productParams, externalCall),
        setMessage,
        null,
        null,
        !isStrategyConfigurable,
        addRecentTransaction,
        `Create product | Slicer #${slicerId}`
      )
      if (eventLogs) {
        saEvent("create_product_success")
        setLogs(eventLogs)

        if (!isStrategyConfigurable) {
          setUploadStep(11)

          setTimeout(() => {
            setUploadStep(12)
          }, 3000)
        }

        await handleSuccess(
          signer,
          slicerId,
          newProduct.id,
          eventLogs,
          priceParams,
          setUploadStep
        )
        setSuccess(true)
        setModalView({ name: "" })
      } else {
        throw new Error()
      }
    } catch (err) {
      saEvent("create_product_fail")
      setUploadStep(9)

      await handleReject(slicerId, image, data, purchaseDataCID, newProduct.id)
      setUploadStep(10)
      setCloneAddress("")
      if (err.message) {
        setMessage({
          message: err.message,
          messageStatus: "error"
        })
      }
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
        Products can be used to sell anything, including executing custom
        on-chain logic upon purchase (such as minting NFTs).
      </p>
      <div>
        <hr className="w-20 mx-auto my-16 border-gray-300" />
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
      <AddProductFormAvailability
        isMultiple={isMultiple}
        isLimited={isLimited}
        units={units}
        maxUnits={maxUnits}
        setIsMultiple={setIsMultiple}
        setIsLimited={setIsLimited}
        setUnits={setUnits}
        setMaxUnits={setMaxUnits}
      />
      <AddProductFormPrice
        isFree={isFree}
        ethValue={ethValue}
        usdValue={usdValue}
        isUSD={isUSD}
        setEthValue={setEthValue}
        setUsdValue={setUsdValue}
        setIsUSD={setIsUSD}
        units={units}
        setPriceParams={setPriceParams}
      />
      <AddProductFormExternal
        clonePurchaseHook={clonePurchaseHook}
        setClonePurchaseHook={setClonePurchaseHook}
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
        units={Number(units)}
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
        externalAddress={priceParams?.address}
        targetPrice={
          priceParams?.args &&
          Number(
            ethers.BigNumber.from(priceParams.args[0]).div(
              ethers.BigNumber.from(10).pow(15)
            )
          ) / 1000
        }
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
