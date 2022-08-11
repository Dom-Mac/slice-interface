import Image from "next/image"
import ethImg from "public/eth.svg"
import withdrawImg from "public/download.svg"
import { ethers } from "ethers"

const ToWithdrawItem = ({ currency, key }) => {
  return (
    <div
      key={key}
      className="flex justify-between p-2 border rounded-lg border-sky-400"
    >
      <div className="flex items-center">
        <input
          type="checkbox"
          className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
        />
        <div className="h-6 mx-2">
          <Image src={ethImg} alt="ETH" width={24} height={24} />
        </div>
        <div className="pt-1 text-left">
          <p className="text-lg font-normal leading-none">ETH</p>
          <p className="text-xs font-normal text-slate-400">Ethereum</p>
        </div>
      </div>
      {/* <div className="flex items-center">
        <div className="pt-1 text-right">
          <p className="text-lg font-normal">{toWithdrawEth}</p>
          <p className="text-xs font-normal text-slate-400">
            $ {toWithdrawUsd}
          </p>
        </div>
        <div className="h-6 pl-4" onClick={handleWithdraw}>
          <Image src={withdrawImg} alt="download" width={24} height={24} />
        </div>
      </div> */}
    </div>
  )
}

export default ToWithdrawItem
