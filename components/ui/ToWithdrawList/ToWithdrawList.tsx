import { Withdraw, BatchWithdraw } from "@lib/handlers/chain"
import { useState } from "react"
import { useSigner } from "wagmi"
import ToWithdrawItem from "../ToWithdrawItem"

type Props = {
  currencies: any
  tokensMetadata: any[]
  account: string
  tokensQuotes: any
}

const ToWithdrawList = ({
  currencies,
  tokensMetadata,
  account,
  tokensQuotes
}: Props) => {
  const { data: signer } = useSigner()
  const [selectedTokens, setSelectedTokens] = useState([])

  const handleSelectAll = () => {
    let addresses = []
    if (selectedTokens.length === 0) {
      currencies.forEach((currency) => {
        if (currency.toWithdraw > 0) {
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

  return (
    <div className="w-screen px-4 -mb-10 -ml-4 pt-7 bg-slate-800 dark:bg-slate-800 rounded-t-2xl container-list">
      <div className="flex justify-between mb-8">
        <p
          className="text-xs font-normal text-slate-400"
          onClick={handleSelectAll}
        >
          {selectedTokens.length === 0 ? "Select all" : "Deselect all"}
        </p>
        <p className="text-sm font-normal border-b border-yellow-400">
          {selectedTokens.length > 0 ? "Widthraw selected" : "Widthraw all"}
        </p>
      </div>
      {currencies?.map((currency, index) => {
        if (currency.toWithdraw > 1) {
          const symbol = tokensMetadata[index]?.symbol

          return (
            <ToWithdrawItem
              currency={currency}
              tokenMetadata={tokensMetadata[index]}
              tokenQuote={tokensQuotes[symbol]}
              account={account}
              signer={signer}
              isChecked={selectedTokens.includes(currency.id.split("-")[1])}
              key={index}
              handleSelected={handleSelected}
            />
          )
        }
      })}
    </div>
  )
}

export default ToWithdrawList
