import Image from "next/image"
import { ethers, Signer } from "ethers"
import { Withdraw } from "@lib/handlers/chain"
import { Dispatch, SetStateAction, useEffect, useState } from "react"
import BlockchainCall from "../BlockchainCall"
import { LogDescription } from "ethers/lib/utils"
import Download from "@components/icons/Download"
import { Currency } from "@utils/useCurrenciesData"
import { darkColorList } from "@utils/colorList"
import ethImg from "public/eth.svg"

type Props = {
  currency: Currency
  currencies: Currency[]
  setCurrencies: Dispatch<SetStateAction<Currency[]>>
  account: string
  signer: Signer
  handleSelected: (e: any) => void
  isChecked: boolean
}

const ToWithdrawItem = ({
  currency,
  currencies,
  setCurrencies,
  account,
  signer,
  handleSelected,
  isChecked
}: Props) => {
  const [success, setSuccess] = useState(false)
  const [logs, setLogs] = useState<LogDescription[]>()
  const addr0 = ethers.constants.AddressZero
  const address = currency.id.split("-")[1]
  const color =
    darkColorList[Math.floor(Math.random() * darkColorList.length)][1]

  const toWithdrawToken =
    address === addr0
      ? Number(ethers.utils.formatEther(currency?.toWithdraw || 0)).toFixed(6)
      : currency?.toWithdraw
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
      className={`flex justify-between p-2 mb-4 border rounded-lg border-sky-400 ${
        isChecked ? "bg-slate-900" : null
      }`}
    >
      <div className="flex items-center">
        <input
          type="checkbox"
          className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded md:w-6 md:h-6 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
          checked={isChecked}
          onChange={handleSelected}
          id={currency?.id.split("-")[1]}
        />
        <div className="w-6 mx-2 md:w-10 md:mx-4">
          {currency?.logo || address === addr0 ? (
            <Image
              src={address === addr0 ? ethImg : currency?.logo}
              alt="Token logo"
              layout="responsive"
              width={24}
              height={24}
            />
          ) : (
            <p
              className={`w-6 h-6 md:w-10 md:h-10 text-white ${color} rounded-full align-middle leading-6 md:leading-10 font-semibold`}
            >
              {currency?.symbol?.slice(0, 3)}
            </p>
          )}
        </div>
        <div className="pt-1 text-left">
          <p className="text-lg font-normal leading-none md:text-xl">
            {currency?.symbol}
          </p>
          <p className="text-xs font-normal md:text-base text-slate-400">
            {currency?.name}
          </p>
        </div>
      </div>
      <div className="flex items-center">
        <div className="pt-1 pr-4 text-right">
          <p className="text-lg font-normal md:text-xl">{toWithdrawToken}</p>
          <p className="text-xs font-normal md:text-base text-slate-400">
            $ {toWithdrawUsd}
          </p>
        </div>
        {/* TODO: What if message ? */}
        <BlockchainCall
          transactionDescription={`Withdraw ${toWithdrawToken} ${currency?.symbol} `}
          saEventName="withdraw_to_owner"
          action={() => Withdraw(signer, account, currency.id.split("-")[1])}
          success={success}
          setSuccess={setSuccess}
          setLogs={setLogs}
          confetti={false}
          label={
            <Download className="h-6 text-black dark:text-yellow-300 md:h-8 md:w-8" />
          }
          isCustomButton={true}
        />
      </div>
    </div>
  )
}

export default ToWithdrawItem
