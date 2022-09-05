import formatNumber from "@utils/formatNumber"
import { Dispatch, SetStateAction, useEffect, useState } from "react"
import Input from "../Input"
import InputAddress from "../InputAddress"

type Props = {
  addresses: string[]
  shares: number[]
  ownedSlices: number
  setAddresses: Dispatch<SetStateAction<string[]>>
  setShares: Dispatch<SetStateAction<number[]>>
  setTotalShares: Dispatch<SetStateAction<number>>
}

const TransferFormInputSingle = ({
  addresses,
  shares,
  ownedSlices,
  setAddresses,
  setShares,
  setTotalShares
}: Props) => {
  const [resolvedAddress, setResolvedAddress] = useState("")
  const [firstAddress, setFirstAddress] = useState(addresses[0] || "")
  const [firstShares, setFirstShares] = useState(shares[0] || 0)

  const handleSingleChange = (
    value: string | number,
    currentState: string[] | number[],
    setState: Dispatch<SetStateAction<string[] | number[]>>
  ) => {
    let items = currentState
    items[0] = value
    setState(items)
  }

  useEffect(() => {
    handleSingleChange(firstAddress, addresses, setAddresses)
  }, [firstAddress])

  useEffect(() => {
    handleSingleChange(Number(firstShares), shares, setShares)
    setTotalShares(Number(firstShares))
  }, [firstShares])

  return (
    <>
      <div>
        <InputAddress
          label="Receiver address"
          address={firstAddress}
          onChange={setFirstAddress}
          resolvedAddress={resolvedAddress}
          setResolvedAddress={setResolvedAddress}
          required
        />
      </div>
      <div className="pt-2">
        <Input
          type="number"
          placeholder={`Up to ${formatNumber(ownedSlices) || "..."}`}
          label="Slices to transfer"
          min="1"
          value={firstShares != 0 ? firstShares : ""}
          required
          error={firstShares > ownedSlices}
          onChange={setFirstShares}
        />
      </div>
    </>
  )
}

export default TransferFormInputSingle
