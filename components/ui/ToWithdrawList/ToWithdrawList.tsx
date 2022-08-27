import { Withdraw, BatchWithdraw } from "@lib/handlers/chain"
import { Currency } from "@utils/useTokensMetadata"
import { LogDescription } from "ethers/lib/utils"
import { Dispatch, SetStateAction, useEffect, useState } from "react"
import { useSigner } from "wagmi"
import BlockchainCall from "../BlockchainCall"
import FakeWithdrawItems from "../FakeWithdrawItems"
import ToWithdrawItem from "../ToWithdrawItem"

type Props = {
  currencies: Currency[]
  account: string
  setCurrencies: Dispatch<SetStateAction<Currency[]>>
}

const ToWithdrawList = ({ currencies, account, setCurrencies }: Props) => {
  const { data: signer } = useSigner()
  const [selectedTokens, setSelectedTokens] = useState<string[]>([])
  const [success, setSuccess] = useState(false)
  const [logs, setLogs] = useState<LogDescription[]>()
  const currenciesToWithdraw = currencies.filter(
    (currency) => Number(currency.toWithdraw) > 1
  )

  const handleSelectAll = () => {
    let addresses: string[] = []
    if (selectedTokens.length === 0) {
      currencies.forEach((currency) => {
        if (Number(currency.toWithdraw) > 0) {
          addresses.push(currency.id.split("-")[1])
        }
      })
      setSelectedTokens(addresses)
    } else {
      setSelectedTokens([])
    }
  }

  const handleSelected = (e) => {
    const { id, checked } = e.target
    if (!checked) {
      setSelectedTokens(selectedTokens.filter((item) => item !== id))
    } else {
      setSelectedTokens([...selectedTokens, id])
    }
  }

  const withdrawAction = () => {
    const toWithdrawAddresses = currenciesToWithdraw.map((currency) => {
      return currency.id.split("-")[1]
    })

    // If there is only one currency available, withdraw all or selected is the same thing
    if (toWithdrawAddresses.length === 1) {
      return Withdraw(signer, account, toWithdrawAddresses[0])
    } else {
      if (selectedTokens.length === 0) {
        // Withdraw all in batch
        return BatchWithdraw(signer, account, toWithdrawAddresses)
      } else if (selectedTokens.length === 1) {
        // Withdraw the one selected
        return Withdraw(signer, account, selectedTokens[0])
      } else {
        // Withdraw selected in batch
        return BatchWithdraw(signer, account, selectedTokens)
      }
    }
  }

  useEffect(() => {
    if (success) {
      const updatedCurrencies = [...currencies]

      if (selectedTokens.length === 0) {
        updatedCurrencies.forEach((currency, index) => {
          updatedCurrencies[index].withdrawn = String(
            Number(updatedCurrencies[index].withdrawn) +
              Number(updatedCurrencies[index].toWithdraw) -
              1
          )
          updatedCurrencies[index].toWithdraw = "1"
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
          })
      }

      setCurrencies(updatedCurrencies)
      setSelectedTokens([])
    }
  }, [success])

  return (
    <div className="px-4 pb-4 -mb-10 pt-7 container-list md:px-0">
      <div className="absolute left-0 w-screen -z-10 bg-slate-800 rounded-t-2xl background-height"></div>
      <div className="flex justify-between mt-2 md:mt-6 mb-9 ">
        <p
          className="self-end py-1 text-xs font-normal md:text-base text-slate-400"
          onClick={handleSelectAll}
        >
          {selectedTokens.length === 0 ? "Select all" : "Deselect all"}
        </p>
        <div>
          {/* TODO: What if message ? */}
          {currenciesToWithdraw.length ? (
            <BlockchainCall
              transactionDescription={`Withdraw tokens`}
              saEventName="withdraw_to_owner"
              action={() => withdrawAction()}
              success={success}
              setSuccess={setSuccess}
              setLogs={setLogs}
              confetti={false}
              label={
                <p className="text-sm font-normal border-b border-black dark:border-yellow-400 md:text-base">
                  {selectedTokens.length > 0
                    ? "Widthraw selected"
                    : "Widthraw all"}
                </p>
              }
              isCustomButton={true}
            />
          ) : (
            <div className="py-1 pt-[7px] md:pt-[4px]">
              <p className="text-sm font-normal border-b border-black dark:border-yellow-400 md:text-base">
                Widthraw all
              </p>
            </div>
          )}
        </div>
      </div>
      {currenciesToWithdraw?.map((currency, index) => {
        return (
          <ToWithdrawItem
            currency={currency}
            currencies={currencies}
            setCurrencies={setCurrencies}
            account={account}
            signer={signer}
            isChecked={selectedTokens.includes(currency.id.split("-")[1])}
            key={index}
            handleSelected={handleSelected}
          />
        )
      })}
      {!currenciesToWithdraw.length && <FakeWithdrawItems />}
    </div>
  )
}

export default ToWithdrawList
