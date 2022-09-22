import getSelector from "@utils/getSelector"
import { BigNumber, ethers } from "ethers"
import React, { useEffect, useState } from "react"
import {
  Input,
  InputPrice,
  InputSwitch,
  InputAddress,
  Textarea
} from "@components/ui"
import { Hook, HookProps } from "../purchaseHooks"
import timeout from "@utils/timeout"
import calculateRoot from "@utils/calculateRoot"

const label = "Existing hook"

const description = (
  <>
    Send ETH and/or execute on-chain logic on an existing hook inheriting{" "}
    <a
      className="font-bold highlight"
      href="https://github.com/slice-so/contracts-purchasable-template/blob/master/contracts/extensions/Purchasable/SlicerPurchasable.sol"
      target="_blank"
      rel="noreferrer"
    >
      SlicerPurchasable
    </a>
    .
  </>
)

const Component = ({ setParams }: HookProps) => {
  const [allowedAddresses, setAllowedAddresses] = useState([])

  const [data, setData] = useState([])
  const [address, setAddress] = useState("")
  const [resolvedAddress, setResolvedAddress] = useState("")
  const [checkFunctionSignature, setCheckFunctionSignature] = useState("")
  const [execFunctionSignature, setExecFunctionSignature] = useState("")
  const [allowedAddressesString, setAllowedAddressesString] = useState("")
  const [isContractCall, setIsContractCall] = useState(false)
  const [isAllowlist, setIsAllowlist] = useState(false)
  const [isPayable, setIsPayable] = useState(false)
  const [usdValue, setUsdValue] = useState(0)
  const [ethValue, setEthValue] = useState(0)
  const [copiedRoot, setCopiedRoot] = useState(false)

  const signatureParams = "(uint256,uint256,address,uint256,bytes,bytes)"
  const execSelector = execFunctionSignature
    ? getSelector(execFunctionSignature.trim() + signatureParams)
    : "0x00000000"
  const checkSelector = checkFunctionSignature
    ? getSelector(checkFunctionSignature.trim() + signatureParams)
    : "0x00000000"

  const copyRoot = async () => {
    const hexRoot = calculateRoot(allowedAddresses)
    await navigator.clipboard.writeText(hexRoot)
    setCopiedRoot(true)
    await timeout(2000)
    setCopiedRoot(false)
  }

  useEffect(() => {
    const externalAddress = address
      ? address.substring(address.length - 4) !== ".eth"
        ? resolvedAddress != "Invalid ENS name"
          ? address
          : ethers.constants.AddressZero
        : resolvedAddress
      : ethers.constants.AddressZero
    const decimals = BigNumber.from(10).pow(9)
    const ethToWei = BigNumber.from((ethValue * 10 ** 9).toFixed(0)).mul(
      decimals
    )
    setParams({
      allowedAddresses,
      externalCall: {
        data,
        value: ethToWei,
        externalAddress,
        checkFunctionSignature: checkSelector,
        execFunctionSignature: execSelector
      }
    })
  }, [
    data,
    ethValue,
    usdValue,
    address,
    resolvedAddress,
    checkSelector,
    execSelector,
    allowedAddresses
  ])

  useEffect(() => {
    if (isContractCall) {
      setCheckFunctionSignature("isPurchaseAllowed")
      setExecFunctionSignature("onProductPurchase")
    } else {
      setCheckFunctionSignature("")
      setExecFunctionSignature("")
      setAllowedAddresses([])
    }
  }, [isContractCall])

  useEffect(() => {
    if (!isPayable) {
      setEthValue(0)
      setUsdValue(0)
    }
  }, [isPayable])

  useEffect(() => {
    if (isContractCall) {
      const formattedAddresses = allowedAddressesString
        .toLowerCase()
        .replaceAll(/\s/g, "")
        .split(",")
        .filter((address) => address != "")
      setAllowedAddresses(formattedAddresses)
    }
  }, [isContractCall, allowedAddressesString])

  return (
    <>
      <div>
        <InputAddress
          label="External address"
          placeholder="0x…"
          address={address}
          onChange={setAddress}
          required={isPayable || isContractCall}
          resolvedAddress={resolvedAddress}
          setResolvedAddress={setResolvedAddress}
        />
      </div>
      <div className="pt-3">
        <InputSwitch
          label="Send ETH"
          enabled={isPayable}
          setEnabled={setIsPayable}
        />
      </div>
      {isPayable && (
        <>
          <div className="pb-3">
            <InputPrice
              ethValue={ethValue}
              setEthValue={setEthValue}
              usdValue={usdValue}
              setUsdValue={setUsdValue}
              label="Value per unit"
            />
          </div>

          <p className="text-yellow-600">
            <b>The sent value will be added to the unit product price.</b>
          </p>
        </>
      )}
      <div>
        <InputSwitch
          label="Execute contract logic"
          enabled={isContractCall}
          setEnabled={setIsContractCall}
        />
      </div>
      {isContractCall && (
        <>
          <div className="relative">
            <Input
              label="Function signature (check)"
              type="string"
              placeholder="isPurchaseAllowed"
              className="mt-4"
              value={checkFunctionSignature}
              onChange={setCheckFunctionSignature}
              question={
                <>
                  <p>
                    The signature of the function that checks if a buyer is
                    eligible for purchase. See{" "}
                    <a
                      href="https://github.com/slice-so/genesis-nft/blob/main/contracts/extensions/Purchasable/SlicerPurchasable.sol"
                      target="_blank"
                      rel="noreferrer"
                    >
                      example
                    </a>
                    .
                  </p>
                  <p>
                    Called to enable purchases for a buyer on the slicer store
                    on Slice website. Returns true if buyer is allowed.
                  </p>
                  <p>
                    Leave blank if there are no checks to be performed from the
                    Slice interface (the product won&apos;t appear locked)
                  </p>
                </>
              }
            />
            <p className="text-blue-600 dark:text-sky-300 absolute text-xs opacity-80 font-black left-0 bottom-[-23px]">
              {checkSelector}
            </p>
            <p className="absolute text-xs opacity-50 left-0 top-[36px]">
              {signatureParams}
            </p>
          </div>
          <div className="relative pt-4">
            <Input
              label="Function signature (on purchase)"
              type="string"
              placeholder="onProductPurchase"
              className="mt-4"
              value={execFunctionSignature}
              onChange={setExecFunctionSignature}
              question={
                <>
                  <p>
                    The signature of the function that will be executed upon
                    purchase, on the specified external address. See{" "}
                    <a
                      href="https://github.com/slice-so/genesis-nft/blob/main/contracts/extensions/Purchasable/SlicerPurchasable.sol"
                      target="_blank"
                      rel="noreferrer"
                    >
                      example
                    </a>
                    .
                  </p>
                </>
              }
            />
            <p className="text-blue-600 dark:text-sky-300 absolute text-xs opacity-80 font-black left-0 bottom-[-23px]">
              {execSelector}
            </p>
            <p className="absolute text-xs opacity-50 left-0 top-[52px]">
              {signatureParams}
            </p>
          </div>
          <div className="pt-3">
            <InputSwitch
              label="Allowlist"
              enabled={isAllowlist}
              setEnabled={setIsAllowlist}
            />
          </div>
          {isAllowlist && (
            <div className="relative space-y-3">
              <p>
                Specify the addresses that will be able to buy the product,
                checked using merkle proof verification.{" "}
              </p>
              <div className="pt-4">
                <Textarea
                  label="Addresses list (no ENS)"
                  placeholder="Add addresses separated by comma"
                  value={allowedAddressesString}
                  onChange={setAllowedAddressesString}
                  markdownView={false}
                />
              </div>
              <p className="text-blue-600 dark:text-sky-300 absolute text-xs opacity-80 font-black left-0 bottom-[-23px]">
                Total: {allowedAddresses.length}
              </p>
              {allowedAddresses.length != 0 && (
                <p
                  className={`absolute text-xs opacity-80 font-black right-0 bottom-[-23px] ${
                    copiedRoot
                      ? "text-green-600 cursor-default"
                      : "hover:text-blue-600 dark:hover:text-sky-300 cursor-pointer"
                  }`}
                  onClick={async () => !copiedRoot && (await copyRoot())}
                >
                  {copiedRoot ? "Merkle root copied!" : "Copy Merkle root"}
                </p>
              )}
            </div>
          )}
        </>
      )}
    </>
  )
}

const hook: Hook = { label, description, Component }

export default hook
