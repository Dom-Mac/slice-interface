import Image from "next/image"
import { ethers } from "ethers"
import { Dispatch, SetStateAction, useState } from "react"
import { Currency } from "@utils/useCurrenciesData"
import { darkColorList } from "@utils/colorList"
import ethImg from "public/eth.svg"
import InputCheckbox from "../InputCheckbox"
import FundsModuleContract from "artifacts/contracts/FundsModule.sol/FundsModule.json"
import { useContractWrite, usePrepareContractWrite } from "wagmi"
import WithdrawIcon from "@components/icons/WithdrawIcon"
import executeTransaction from "@utils/executeTransaction"
import Spinner from "@components/icons/Spinner"
import { useAddRecentTransaction } from "@rainbow-me/rainbowkit"
import constants from "constants.json"

type Props = {
  account: string
  isChecked: boolean
  currency: Currency
  currencies: Currency[]
  selectedTokens: string[]
  setCurrencies: Dispatch<SetStateAction<Currency[]>>
  setSelectedTokens: Dispatch<SetStateAction<string[]>>
  index: number
}

const ToWithdrawItem = ({
  account,
  isChecked,
  currency,
  currencies,
  selectedTokens,
  setCurrencies,
  setSelectedTokens,
  index
}: Props) => {
  const [loading, setLoading] = useState(false)
  const addr0 = ethers.constants.AddressZero
  const address = currency.id.split("-")[1]
  const color = darkColorList[index % darkColorList.length][1]

  const toWithdrawToken = Number(
    ethers.utils.formatEther(currency?.toWithdraw || 0)
  )
  const toWithdrawUsd = currency.quote
    ? (Number(toWithdrawToken) * Number(currency.quote)).toFixed(2)
    : 0

  const handleSelected = () => {
    if (!isChecked) {
      setSelectedTokens([...selectedTokens, address])
    } else {
      setSelectedTokens(selectedTokens.filter((item) => item !== address))
    }
  }

  const addRecentTransaction = useAddRecentTransaction()
  const { config, error } = usePrepareContractWrite({
    addressOrName:
      constants[process.env.NEXT_PUBLIC_CHAIN_ID][
        process.env.NEXT_PUBLIC_ENVIRONMENT
      ].addresses.FundsModule,
    contractInterface: FundsModuleContract.abi,
    functionName: "withdraw",
    args: [account, address]
  })

  const { writeAsync } = useContractWrite(config)

  const settlementLogic = () => {
    const updatedCurrencies = [...currencies]
    const index = currencies.map((currency) => currency.id).indexOf(currency.id)

    updatedCurrencies[index].withdrawn = String(
      Number(updatedCurrencies[index].withdrawn) +
        Number(updatedCurrencies[index].toWithdraw) -
        1
    )
    updatedCurrencies[index].toWithdraw = "1"
    updatedCurrencies[index].toPayToProtocol = "1"

    setCurrencies(updatedCurrencies)
  }

  return (
    <div className="flex justify-between px-4 py-3 mb-4 bg-white rounded-md shadow-md sm:px-6">
      <div className="flex items-center">
        <InputCheckbox
          checked={isChecked}
          onChange={handleSelected}
          id={address}
        />
        <div className="ml-3 mr-2 sm:ml-4 sm:mr-3 w-9 h-9">
          {currency?.logo || address === addr0 ? (
            <Image
              src={address === addr0 ? ethImg : currency?.logo}
              alt="Token logo"
              layout="responsive"
              width={24}
              height={24}
            />
          ) : (
            <div
              className={`text-xs w-9 h-9 flex justify-center text-white font-semibold items-center rounded-full ${color}`}
            >
              <p>{currency?.symbol?.slice(0, 4)}</p>
            </div>
          )}
        </div>
        <div className="text-left">
          <p>{currency?.symbol}</p>
          <p className="text-sm text-gray-400">{currency?.name}</p>
        </div>
      </div>
      <div className="flex items-center">
        <div className="pr-3 text-right sm:pr-6">
          <p>{Math.floor(Number(toWithdrawToken) * 10000) / 10000}</p>
          <p className="text-sm text-gray-400">$ {toWithdrawUsd}</p>
        </div>
        <div
          className="cursor-pointer hover:text-blue-600"
          onClick={async () =>
            !loading &&
            (await executeTransaction(
              writeAsync,
              setLoading,
              `Withdraw ${currency.symbol}`,
              addRecentTransaction,
              settlementLogic
            ))
          }
        >
          {loading ? (
            <Spinner size="w-7 h-6" />
          ) : (
            <WithdrawIcon className="rotate-180 w-7 h-7" />
          )}
        </div>
      </div>
    </div>
  )
}

export default ToWithdrawItem
