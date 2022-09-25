import { NewTransaction } from "@rainbow-me/rainbowkit/dist/transactions/transactionStore"
import executeTransaction from "@utils/executeTransaction"
import { BigNumber } from "ethers"
import { formatEther } from "ethers/lib/utils"
import { useContractWrite, usePrepareContractWrite } from "wagmi"
import { Button } from "@components/ui"
import Slicer from "artifacts/contracts/Slicer.sol/Slicer.json"
import { useAppContext } from "../context"
import { useState } from "react"

type Props = {
  slicerAddress: string
  unreleasedAmount: {
    currency: string
    amount: BigNumber
    symbol?: string
  }
  addRecentTransaction: (transaction: NewTransaction) => void
}

const ButtonRelease = ({
  slicerAddress,
  unreleasedAmount,
  addRecentTransaction
}: Props) => {
  const [loading, setLoading] = useState(false)
  const { account } = useAppContext()

  const symbol = unreleasedAmount.symbol || "???"

  const { config, error } = usePrepareContractWrite({
    addressOrName: slicerAddress,
    contractInterface: Slicer.abi,
    functionName: "release",
    args: [account, unreleasedAmount.currency, false]
  })
  const { writeAsync } = useContractWrite(config)

  console.log(unreleasedAmount.symbol)

  return (
    <Button
      label={`Release ${formatEther(unreleasedAmount.amount)} ${symbol}`}
      loading={loading}
      onClick={async () =>
        await executeTransaction(
          writeAsync,
          setLoading,
          `Release ${symbol}`,
          addRecentTransaction
        )
      }
    />
  )
}

export default ButtonRelease
