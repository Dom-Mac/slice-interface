import { Currency } from "@utils/useCurrenciesData"
import React, { Dispatch, SetStateAction, useEffect, useState } from "react"
import { useContractWrite, usePrepareContractWrite } from "wagmi"
import FakeWithdrawItems from "../FakeWithdrawItems"
import { Button, InputCheckbox, ToWithdrawItem } from "@components/ui"
import FundsModuleContract from "artifacts/contracts/FundsModule.sol/FundsModule.json"
import WithdrawIcon from "@components/icons/WithdrawIcon"
import executeTransaction from "@utils/executeTransaction"
import { useAddRecentTransaction } from "@rainbow-me/rainbowkit"
import { Currency as DbCurrency } from "@prisma/client"
import constants from "constants"

type Props = {
  currencies: Currency[]
  account: string
  setCurrencies: Dispatch<SetStateAction<Currency[]>>
}

const ToWithdrawList = ({ currencies, account, setCurrencies }: Props) => {
  const [selectedTokens, setSelectedTokens] = useState<string[]>([])
  const [loading, setLoading] = useState(false)

  const currenciesToWithdraw = currencies?.filter(
    (currency) => Number(currency.toWithdraw) > 1
  )
  const toWithdrawAddresses = currenciesToWithdraw?.map((currency) => {
    return currency.id.split("-")[1]
  })

  const currenciesParam = currenciesToWithdraw
    ? // If there is only one currency available, single withdraw
      toWithdrawAddresses?.length === 1
      ? toWithdrawAddresses[0]
      : // If no currency is selected, batch withdraw (all)
      selectedTokens?.length === 0
      ? toWithdrawAddresses
      : // If one currency is selected, single withdraw
      selectedTokens?.length === 1
      ? selectedTokens[0]
      : // Else, if multiple currencies are selected, batch withdraw (selected)
        selectedTokens
    : []

  const withdrawButtonText =
    selectedTokens?.length > 0 ? "Widthraw selected" : "Widthraw all"

  const handleSelectAll = () => {
    let addresses: string[] = []
    if (selectedTokens.length === 0) {
      currencies?.forEach((currency) => {
        if (Number(currency.toWithdraw) > 0) {
          addresses.push(currency.id.split("-")[1])
        }
      })
      setSelectedTokens(addresses)
    } else {
      setSelectedTokens([])
    }
  }

  const txDescription =
    toWithdrawAddresses?.length === 1 || selectedTokens?.length === 1
      ? `Withdraw`
      : "Batch withdraw"
  const addRecentTransaction = useAddRecentTransaction()
  const { config, error } = usePrepareContractWrite({
    addressOrName:
      constants[process.env.NEXT_PUBLIC_CHAIN_ID][
        process.env.NEXT_PUBLIC_ENVIRONMENT
      ].addresses.FundsModule,
    contractInterface: FundsModuleContract.abi,
    functionName:
      toWithdrawAddresses?.length === 1 || selectedTokens?.length === 1
        ? "withdraw"
        : "batchWithdraw",
    args: [account, currenciesParam]
  })

  const { writeAsync } = useContractWrite(config)

  const settlementLogic = () => {
    const updatedCurrencies = [...currencies]

    if (selectedTokens.length === 0) {
      updatedCurrencies.forEach((currency, index) => {
        updatedCurrencies[index].withdrawn = String(
          Number(updatedCurrencies[index].withdrawn) +
            Number(updatedCurrencies[index].toWithdraw) -
            1
        )
        updatedCurrencies[index].toWithdraw = "1"
        updatedCurrencies[index].toPayToProtocol = "1"
      })
    } else {
      updatedCurrencies
        .filter((currency) =>
          selectedTokens.includes(currency.id.split("-")[1])
        )
        .forEach((currency) => {
          const index = currencies
            .map((currency) => currency.id)
            .indexOf(currency.id)

          updatedCurrencies[index].withdrawn = String(
            Number(updatedCurrencies[index].withdrawn) +
              Number(updatedCurrencies[index].toWithdraw) -
              1
          )
          updatedCurrencies[index].toWithdraw = "1"
          updatedCurrencies[index].toPayToProtocol = "1"
        })
    }

    setCurrencies(updatedCurrencies)
    setSelectedTokens([])
  }

  useEffect(() => {
    setSelectedTokens([])
  }, [account])

  return (
    <div className="pb-4 background-height sm:min-h-[200px]">
      <div className="absolute left-0 w-screen bg-gray-100 -z-10 rounded-t-2xl background-height"></div>
      <div className="flex items-center justify-between pt-12 pb-8 pl-4 pr-2 sm:px-6">
        {currenciesToWithdraw && currenciesToWithdraw.length != 0 && (
          <>
            <InputCheckbox
              checked={selectedTokens.length !== 0}
              onChange={handleSelectAll}
              label={
                selectedTokens.length === 0 ? "Select all" : "Deselect all"
              }
              labelClassName="pl-3 text-gray-600"
            />
            <div>
              <Button
                className="h-[40px] rounded-sm nightwind-prevent px-4 sm:px-7 min-w-[150px] focus:outline-none group"
                label={
                  <div className="flex items-center font-medium">
                    <p className="pr-2 text-sm sm:text-base">
                      {withdrawButtonText}
                    </p>
                    <WithdrawIcon className="w-5 h-5 rotate-180" />
                  </div>
                }
                double={false}
                onClick={async () =>
                  await executeTransaction(
                    writeAsync,
                    setLoading,
                    txDescription,
                    addRecentTransaction,
                    settlementLogic
                  )
                }
                loading={loading}
              />
            </div>
          </>
        )}
      </div>
      {currencies ? (
        currenciesToWithdraw?.length ? (
          currenciesToWithdraw?.map((currency, index) => {
            return (
              <ToWithdrawItem
                key={index}
                currency={currency}
                currencies={currencies}
                setCurrencies={setCurrencies}
                account={account}
                isChecked={selectedTokens.includes(currency.id.split("-")[1])}
                index={index}
                selectedTokens={selectedTokens}
                setSelectedTokens={setSelectedTokens}
              />
            )
          })
        ) : (
          <p className="text-lg sm:text-xl">Nothing to withdraw 🙌</p>
        )
      ) : (
        [...Array(3).keys()].map((el, i) => <FakeWithdrawItems key={i} />)
      )}
    </div>
  )
}

export default ToWithdrawList
