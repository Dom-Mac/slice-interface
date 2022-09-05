import { InputAddress } from "@components/ui"
import { useEffect, useState } from "react"
import { defaultExternalCall, Hook, HookProps } from "../purchaseHooks"

import clonerInterface from "./abi/cloner.json"
import factoryInterface from "./abi/factory.json"
import deployments from "./deployments.json"

const label = "ERC721 NFT-gate"

const description =
  "Allow purchases only from buyers with at least 1 NFT of the specified collection"

const Component = ({ setParams }: HookProps) => {
  const [address, setAddress] = useState("")
  const [resolvedAddress, setResolvedAddress] = useState("")

  useEffect(() => {
    setParams({
      externalCall: defaultExternalCall,
      deploy: {
        deployments,
        abi: {
          clonerInterface: clonerInterface.abi,
          factoryInterface: factoryInterface.abi
        },
        args: [address]
      }
    })
  }, [address])

  return (
    <>
      <div>
        <InputAddress
          label="ERC721 contract address"
          address={address}
          onChange={setAddress}
          resolvedAddress={resolvedAddress}
          setResolvedAddress={setResolvedAddress}
          placeholder="0x…"
          required
        />
      </div>
    </>
  )
}

const hook: Hook = { label, description, Component, deployments }

export default hook
