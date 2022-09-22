import { InputAddress } from "@components/ui"
import { useEffect, useState } from "react"
import { Strategy, StrategyProps } from "../strategies"

const label = "Custom"

const Component = ({ setPriceParams }: StrategyProps) => {
  const [address, setAddress] = useState("")
  const [resolvedAddress, setResolvedAddress] = useState("")

  useEffect(() => {
    if (
      address &&
      resolvedAddress != "" &&
      resolvedAddress != "Invalid ENS name"
    ) {
      setPriceParams({
        label: "",
        address: resolvedAddress || address
      })
    }

    return () => {
      setPriceParams(undefined)
    }
  }, [address, resolvedAddress])

  return (
    <>
      <p>
        Add a custom pricing logic in a smart contract which inherits the{" "}
        <a
          href="https://github.com/slice-so/contracts-pricing/blob/master/src/Slice/interfaces/utils/ISliceProductPrice.sol"
          target="_blank"
          rel="noreferrer"
          className="highlight"
        >
          ISliceProductPrice
        </a>{" "}
        interface.
      </p>
      <div>
        <InputAddress
          label="Contract address"
          placeholder="0x…"
          address={address}
          onChange={setAddress}
          required
          resolvedAddress={resolvedAddress}
          setResolvedAddress={setResolvedAddress}
        />
      </div>
    </>
  )
}

const hook: Strategy = { label, Component }

export default hook
