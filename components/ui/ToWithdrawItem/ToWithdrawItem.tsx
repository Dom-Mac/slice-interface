import Image from "next/image"
import withdrawImg from "public/download.svg"
import { ethers } from "ethers"
import useTokenMetadata from "@utils/useTokenMetadata"
import { useEffect } from "react"

const ToWithdrawItem = ({ currency }) => {
  const currencyAddress = currency?.id.split("-")[1]
  const tokenMetadata = useTokenMetadata(currencyAddress)
  console.log(currency)
  const toWithdrawToken = currency?.toWithdraw
  const toWithdrawUsd = currency?.toWithdraw

  return (
    <div className="flex justify-between p-2 border rounded-lg border-sky-400">
      <div className="flex items-center">
        <input
          type="checkbox"
          className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
        />
        <div className="h-6 mx-2">
          {tokenMetadata?.logo && (
            <Image src={tokenMetadata.logo} alt="ETH" width={24} height={24} />
          )}
        </div>
        <div className="pt-1 text-left">
          <p className="text-lg font-normal leading-none">
            {tokenMetadata?.symbol}
          </p>
          <p className="text-xs font-normal text-slate-400">
            {tokenMetadata?.name}
          </p>
        </div>
      </div>
      <div className="flex items-center">
        <div className="pt-1 text-right">
          <p className="text-lg font-normal">{toWithdrawToken}</p>
          <p className="text-xs font-normal text-slate-400">
            $ {toWithdrawUsd}
          </p>
        </div>
        <div className="h-6 pl-4">
          <Image src={withdrawImg} alt="download" width={24} height={24} />
        </div>
      </div>
    </div>
  )
}

export default ToWithdrawItem
