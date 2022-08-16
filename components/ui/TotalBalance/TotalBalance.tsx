import VisibilityOpen from "@components/icons/VisibilityOpen"
import VisibilityClosed from "@components/icons/VisibilityClosed"
import { ethers } from "ethers"
import { useState } from "react"

const TotalBalance = ({ currencies, tokensMetadata, tokensQuotes }) => {
  const [isBlurred, setIsBlurred] = useState(false)
  const addr0 = ethers.constants.AddressZero
  let totalToWithdraw = 0
  let totalEarned = 0
  let plusTokens = 0
  let cashback = 0

  // TokensQuotes is the last state to be updated, if is available all other states are available
  if (Object.keys(tokensQuotes).length) {
    currencies.forEach((currency, index) => {
      const symbol = tokensMetadata[index]?.symbol
      const usdPrice = tokensQuotes[symbol]

      // If the currency has been withdrawn, add the amount to the total to withdraw
      if (currency.withdrawn > 0 && usdPrice) {
        const withdrawn =
          currency.id.split("-")[1] == addr0
            ? Number(ethers.utils.formatEther(currency.withdrawn))
            : Number(currency.withdrawn)

        totalEarned += withdrawn * usdPrice
      }

      // If the currency is available for withdrawn, add the amount to the total to withdraw
      if (currency.toWithdraw > 1) {
        const toWithdraw =
          currency.id.split("-")[1] == addr0
            ? Number(ethers.utils.formatEther(currency.toWithdraw))
            : Number(currency.toWithdraw)

        if (usdPrice) {
          totalToWithdraw += toWithdraw * usdPrice
          totalEarned += toWithdraw * usdPrice
        } else {
          plusTokens += toWithdraw
        }
      }

      // only if the currency is eth calculate SLX cashback
      if (currency.id.split("-")[1] == addr0) {
        cashback +=
          Number(currency.toPayToProtocol) + Number(currency.paidToProtocol)
      }
    })

    // Round numbers to 2 decimals
    totalToWithdraw = Number(totalToWithdraw.toFixed(2))
    totalEarned = Number(totalEarned.toFixed(2))
  }

  return (
    <>
      <div className="flex items-center mb-4">
        <p className="mr-3 text-lg ">My balance</p>
        <div onClick={() => setIsBlurred(!isBlurred)}>
          {isBlurred ? (
            <VisibilityClosed className="h-6" />
          ) : (
            <VisibilityOpen className="h-6" />
          )}
        </div>
      </div>
      <div
        className={`flex justify-between w-3/5 p-2 rounded-lg min-w-max bg-slate-800 dark:bg-slate-800 ${
          isBlurred ? "blur" : null
        }`}
      >
        <div className="text-left ">
          <p className="text-xs font-normal text-slate-400">Total earned</p>
          <p className="text-lg font-semibold">$ {totalEarned}</p>
          {/* {cashback > 0 && (
            <p className="text-xs font-normal text-green-500">
              +{cashback} SLX cashback
            </p>
          )} */}
        </div>
        <div className="text-left ">
          <p className="text-xs font-normal text-slate-400">To withdraw</p>
          <p className="text-lg font-semibold">$ {totalToWithdraw}</p>
          {plusTokens > 0 && (
            <p className="text-xs font-normal text-green-500">
              +{plusTokens} token{plusTokens > 1 ? "s" : null}
            </p>
          )}
        </div>
      </div>
      <p className="p-2 mb-5 text-xs font-normal text-left text-slate-500 ">
        Current SLX cashback fee: 2.5%
      </p>
    </>
  )
}

export default TotalBalance
