import Image from "next/image"
import { ethers } from "ethers"
import { Withdraw } from "@lib/handlers/chain"
import { useEffect, useState } from "react"
import BlockchainCall from "../BlockchainCall"
import { LogDescription } from "ethers/lib/utils"
import Download from "@components/icons/Download"

const ToWithdrawItem = ({
  currency,
  currencies,
  setCurrencies,
  account,
  signer,
  handleSelected,
  isChecked
}) => {
  const [success, setSuccess] = useState(false)
  const [logs, setLogs] = useState<LogDescription[]>()

  const toWithdrawToken = Number(
    ethers.utils.formatEther(currency?.toWithdraw || 0)
  ).toFixed(6)
  const toWithdrawUsd = currency.quote
    ? (Number(toWithdrawToken) * Number(currency.quote)).toFixed(2)
    : 0

  useEffect(() => {
    if (success) {
      const updatedCurrencies = [...currencies]
      const index = currencies
        .map((currency) => currency.id)
        .indexOf(currency.id)

      updatedCurrencies[index].withdrawn = String(
        Number(updatedCurrencies[index].withdrawn) +
          Number(updatedCurrencies[index].toWithdraw) -
          1
      )
      updatedCurrencies[index].toWithdraw = "1"

      setCurrencies(updatedCurrencies)
    }
  }, [success])

  return (
    <div
      className={`flex justify-between p-2 border rounded-lg border-sky-400 ${
        isChecked ? "bg-slate-900" : null
      }`}
    >
      <div className="flex items-center">
        <input
          type="checkbox"
          className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
          checked={isChecked}
          onChange={handleSelected}
          id={currency?.id.split("-")[1]}
        />
        <div className="h-6 mx-2">
          {currency.metadata?.logo && (
            <Image
              src={currency.metadata?.logo}
              alt="Token logo"
              width={24}
              height={24}
            />
          )}
        </div>
        <div className="pt-1 text-left">
          <p className="text-lg font-normal leading-none">
            {currency.metadata?.symbol}
          </p>
          <p className="text-xs font-normal text-slate-400">
            {currency.metadata?.name}
          </p>
        </div>
      </div>
      <div className="flex items-center">
        <div className="pt-1 pr-4 text-right">
          <p className="text-lg font-normal">{toWithdrawToken}</p>
          <p className="text-xs font-normal text-slate-400">
            $ {toWithdrawUsd}
          </p>
        </div>
        {/* TODO: What if message ? */}
        <BlockchainCall
          transactionDescription={`Withdraw ${toWithdrawToken} ${currency.metadata?.symbol} `}
          saEventName="withdraw_to_owner"
          action={() => Withdraw(signer, account, currency.id.split("-")[1])}
          success={success}
          setSuccess={setSuccess}
          setLogs={setLogs}
          confetti={true}
          label={
            <div className="h-6">
              <Download
                width={24}
                height={24}
                className="text-black dark:text-yellow-300"
              />
            </div>
          }
          isCustomButton={true}
        />
      </div>
    </div>
  )
}

export default ToWithdrawItem
