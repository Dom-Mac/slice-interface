import { Withdraw, BatchWithdraw } from "@lib/handlers/chain"
import { LogDescription } from "ethers/lib/utils"
import { useState } from "react"
import { useSigner } from "wagmi"
import BlockchainCall from "../BlockchainCall"
import ToWithdrawItem from "../ToWithdrawItem"

type Props = {
  currencies: any
  tokensMetadata: any[]
  account: string
  tokensQuotes: any
}

const ToWithdrawList = ({ currencies, account }: Props) => {
  const { data: signer } = useSigner()
  const [selectedTokens, setSelectedTokens] = useState([])
  const [success, setSuccess] = useState(false)
  const [logs, setLogs] = useState<LogDescription[]>()

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

  const withdrawAction = () => {
    const currenciesToWithdraw = currencies
      .filter((currency) => currency.toWithdraw > 1)
      .map((currency) => {
        return currency.id.split("-")[1]
      })

    // If there is only one currency available, withdraw all or selected is the same thing
    if (currenciesToWithdraw.length === 1) {
      return Withdraw(signer, account, currenciesToWithdraw[0])
    } else {
      if (selectedTokens.length === 0) {
        // Withdraw all in batch
        return BatchWithdraw(signer, account, currenciesToWithdraw)
      } else if (selectedTokens.length === 1) {
        // Withdraw the one selected
        return Withdraw(signer, account, selectedTokens[0])
      } else {
        // Withdraw selected in batch
        return BatchWithdraw(signer, account, selectedTokens)
      }
    }
  }

  return (
    <div className="w-screen px-4 -mb-10 -ml-4 pt-7 bg-slate-800 dark:bg-slate-800 rounded-t-2xl container-list">
      <div className="flex justify-between mb-9">
        <p
          className="self-end py-1 text-xs font-normal text-slate-400"
          onClick={handleSelectAll}
        >
          {selectedTokens.length === 0 ? "Select all" : "Deselect all"}
        </p>
        <div>
          <BlockchainCall
            transactionDescription={`Withdraw tokens`}
            saEventName="withdraw_to_owner"
            action={() => withdrawAction()}
            success={success}
            setSuccess={setSuccess}
            setLogs={setLogs}
            confetti={true}
            label={
              <p className="text-sm font-normal border-b border-yellow-400">
                {selectedTokens.length > 0
                  ? "Widthraw selected"
                  : "Widthraw all"}
              </p>
            }
            isCustomButton={true}
          />
        </div>
      </div>
      {currencies?.map((currency, index) => {
        if (currency.toWithdraw > 1) {
          return (
            <ToWithdrawItem
              currency={currency}
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
