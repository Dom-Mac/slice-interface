import { InputAddress } from "@components/ui"
import { useEffect, useState } from "react"
import { defaultExternalCall, Hook, HookProps } from "../purchaseHooks"
import clonerInterface from "./clonerInterface.json"

const label = "ERC721 NFT-gate"

const description =
  "Allow purchases only from buyers with at least 1 NFT of the specified collection"

const factoryAddresses = {
  1: "0x7AA23E00283d20976d942c510c0821A04f7010Bc",
  4: "0xC98b1Ec9bD4Cc0B4A6C0D32Dd4b2b39b43098856"
}

const Component = ({ setParams }: HookProps) => {
  const [address, setAddress] = useState("")
  const [resolvedAddress, setResolvedAddress] = useState("")

  useEffect(() => {
    setParams({
      externalCall: defaultExternalCall,
      deploy: {
        factoryAddresses,
        abi: clonerInterface.abi,
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

const hook: Hook = { label, description, Component, factoryAddresses }

export default hook
