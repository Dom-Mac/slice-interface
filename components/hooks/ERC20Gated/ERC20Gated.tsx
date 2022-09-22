import { Input, InputAddress } from "@components/ui"
import { BigNumber } from "ethers"
import { useEffect, useState } from "react"
import {
  defaultExternalCall,
  emptyExternalCall,
  Hook,
  HookProps
} from "../purchaseHooks"

import clonerInterface from "./abi/cloner.json"
import factoryInterface from "./abi/factory.json"
import deployments from "./deployments.json"

const label = "ERC20 token-gate"

const description =
  "Allow purchases only from buyers with the specified amount of ERC20 tokens"

const Component = ({ setParams }: HookProps) => {
  const [address, setAddress] = useState("")
  const [resolvedAddress, setResolvedAddress] = useState("")
  const [gateAmount, setGateAmount] = useState(0)

  useEffect(() => {
    if (gateAmount) {
      setParams({
        externalCall: defaultExternalCall,
        deploy: {
          deployments,
          abi: {
            clonerInterface: clonerInterface.abi,
            factoryInterface: factoryInterface.abi
          },
          args: [address, BigNumber.from(10).pow(18).mul(gateAmount)]
        }
      })
    } else {
      setParams({
        externalCall: emptyExternalCall
      })
    }
  }, [address, gateAmount])

  return (
    <>
      <div>
        <InputAddress
          label="ERC20 contract address"
          address={address}
          onChange={setAddress}
          resolvedAddress={resolvedAddress}
          setResolvedAddress={setResolvedAddress}
          placeholder="0x…"
          required
        />
      </div>
      <div>
        <Input
          type="number"
          label="Token gate amount (mul by 10^18)"
          min={0}
          value={gateAmount}
          onChange={setGateAmount}
          required
        />
      </div>
    </>
  )
}

const hook: Hook = { label, description, Component, deployments }

export default hook
