import TriggerBatchReleaseSlicers from "@lib/handlers/chain/TriggerBatchReleaseSlicers"
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

  return (
    <div className="w-screen px-4 -mb-10 -ml-4 pt-7 bg-slate-800 dark:bg-slate-800 rounded-t-2xl container-list">
      <div className="flex justify-between mb-8">
        <p className="text-xs font-normal text-slate-400">Select all</p>
        <p className="text-sm font-normal border-b border-yellow-400">
          Widthraw all
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
              key={index}
            />
          )
        }
      })}
    </div>
  )
}

export default ToWithdrawList
