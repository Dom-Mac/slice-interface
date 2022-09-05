import { useEffect, useState } from "react"
import {
  defaultExternalCall,
  emptyExternalCall,
  Hook,
  HookProps
} from "../purchaseHooks"
import { Textarea } from "@components/ui"
import calculateRoot from "@utils/calculateRoot"

import clonerInterface from "./abi/cloner.json"
import factoryInterface from "./abi/factory.json"
import deployments from "./deployments.json"

const label = "Allowlist"

const description =
  "Allow purchases only from allowlisted addresses, using Merkle proof verification"

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
        externalCall: defaultExternalCall,
        allowedAddresses,
        deploy: {
          deployments,
          abi: {
            clonerInterface: clonerInterface.abi,
            factoryInterface: factoryInterface.abi
          },
          args: [merkleRoot]
        }
      })
    } else {
      setParams({
        externalCall: emptyExternalCall
      })
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

const hook: Hook = { label, description, Component, deployments }

export default hook
