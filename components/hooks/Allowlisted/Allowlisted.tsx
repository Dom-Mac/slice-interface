import { useEffect, useState } from "react"
import {
  defaultExternalCall,
  emptyExternalCall,
  Hook,
  HookProps
} from "../purchaseHooks"
import clonerInterface from "./clonerInterface.json"
import { Textarea } from "@components/ui"
import calculateRoot from "@utils/calculateRoot"

const label = "Allowlist"

const description =
  "Allow purchases only from allowlisted addresses, using Merkle proof verification"

const factoryAddresses = {
  1: "0x360737289ea84FEeE7a337aD593A1792909870C9",
  4: "0x06686c6ce1800963Be8b4D03C24E666fe21038d0"
}

const Component = ({ setParams }: HookProps) => {
  const [allowedAddressesText, setAllowedAddressesText] = useState("")

  const allowedAddresses = allowedAddressesText
    .toLowerCase()
    .replaceAll(/\s/g, "")
    .split(",")
    .filter((address) => address != "")

  useEffect(() => {
    const merkleRoot = calculateRoot(allowedAddresses)

    if (merkleRoot != "0x") {
      setParams({
        allowedAddresses,
        externalCall: defaultExternalCall,
        deploy: {
          factoryAddresses,
          abi: clonerInterface.abi,
          args: [merkleRoot]
        }
      })
    } else {
      setParams({ externalCall: emptyExternalCall })
    }
  }, [allowedAddressesText])

  return (
    <div className="relative">
      <Textarea
        label="Addresses list (no ENS)"
        placeholder="Add addresses separated by comma"
        value={allowedAddressesText}
        onChange={setAllowedAddressesText}
        markdownView={false}
      />
      <p className="text-blue-600 dark:text-sky-300 absolute text-xs opacity-80 font-black left-0 bottom-[-23px]">
        Total: {allowedAddresses.length}
      </p>
    </div>
  )
}

const hook: Hook = { label, description, Component, factoryAddresses }

export default hook
