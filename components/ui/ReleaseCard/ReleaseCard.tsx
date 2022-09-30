import { NewTransaction } from "@rainbow-me/rainbowkit/dist/transactions/transactionStore"
import executeTransaction from "@utils/executeTransaction"
import { formatEther } from "ethers/lib/utils"
import { useContractWrite, usePrepareContractWrite } from "wagmi"
import { Button } from "@components/ui"
import Slicer from "artifacts/contracts/Slicer.sol/Slicer.json"
import { useAppContext } from "../context"
import { useState } from "react"
import formatNumber from "@utils/formatNumber"
import WithdrawIcon from "@components/icons/WithdrawIcon"
import { UnreleasedAmount } from "../SlicersList/SlicersList"
import Link from "next/link"

type Props = {
  slicerAddress: string
  unreleasedAmount: UnreleasedAmount
  addRecentTransaction: (transaction: NewTransaction) => void
}

const ReleaseCard = ({
  slicerAddress,
  unreleasedAmount,
  addRecentTransaction
}: Props) => {
  const { amount, symbol, currency, quote } = unreleasedAmount
  const { account } = useAppContext()
  const [releaseLoading, setReleaseLoading] = useState(false)
  const [releaseWithdrawLoading, setReleaseWithdrawLoading] = useState(false)
  const [status, setStatus] = useState<"" | "released" | "withdrawn">("")

  const { config: releaseConfig } = usePrepareContractWrite({
    addressOrName: slicerAddress,
    contractInterface: Slicer.abi,
    functionName: "release",
    args: [account, currency, false]
  })
  const { writeAsync: releaseWriteAsync } = useContractWrite(releaseConfig)

  const { config: releaseWithdrawConfig } = usePrepareContractWrite({
    addressOrName: slicerAddress,
    contractInterface: Slicer.abi,
    functionName: "release",
    args: [account, currency, true]
  })
  const { writeAsync: releaseWithdrawWriteAsync } = useContractWrite(
    releaseWithdrawConfig
  )

  const amountToRelease = Number(formatEther(amount))
  const formattedAmount = formatNumber(
    Math.floor(amountToRelease * 1000) / 1000
  )
  const toWithdrawUsd = quote ? (amountToRelease * quote).toFixed(2) : 0

  return (
    <div className="flex items-center justify-between py-2">
      {!status ? (
        <>
          <div>
            <p>
              {formattedAmount} {symbol || "???"}
            </p>
            <p className="text-sm text-gray-400">$ {toWithdrawUsd}</p>
          </div>
          <div className="flex items-center text-sm">
            <Button
              className="h-[34px] font-semibold rounded-l-md nightwind-prevent text-center w-[5.5rem] focus:outline-none"
              label="Release"
              loading={releaseLoading || releaseWithdrawLoading}
              onClick={async () =>
                await executeTransaction(
                  releaseWriteAsync,
                  setReleaseLoading,
                  `Release ${symbol}`,
                  addRecentTransaction,
                  () => setStatus("released")
                )
              }
              double={false}
            />
            <Button
              className="h-[34px] font-semibold rounded-r-md nightwind-prevent w-14 focus:outline-none"
              color={`text-white border-l border-gray-200 ${
                releaseLoading
                  ? "bg-gray-600 cursor-default"
                  : "bg-blue-600 hover:bg-blue-700 focus:bg-blue-700"
              }`}
              label={
                <>
                  <WithdrawIcon className="w-5 h-5 rotate-180" />
                </>
              }
              loading={releaseWithdrawLoading}
              onClick={async () =>
                !releaseLoading &&
                (await executeTransaction(
                  releaseWithdrawWriteAsync,
                  setReleaseWithdrawLoading,
                  `Release ${symbol}`,
                  addRecentTransaction,
                  () => setStatus("withdrawn")
                ))
              }
              double={false}
            />
          </div>
        </>
      ) : status === "released" ? (
        <p className="py-2 text-sm text-green-500">
          You have released{" "}
          <span className="font-medium">
            {formattedAmount} {symbol || "???"}
          </span>
          , check{" "}
          <Link href="/earnings">
            <a className="text-green-500 underline">your earnings</a>
          </Link>{" "}
          to withdraw them!
        </p>
      ) : (
        <p className="py-2 text-sm text-green-500">
          You have released and withdrawn{" "}
          <span className="font-medium">
            {formattedAmount} {symbol || "???"}
          </span>
          ! 🎉
        </p>
      )}
    </div>
  )
}

export default ReleaseCard
