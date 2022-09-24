import VisibilityOpen from "@components/icons/VisibilityOpen"
import VisibilityClosed from "@components/icons/VisibilityClosed"
import { ethers } from "ethers"
import { useState } from "react"

const TotalBalance = ({ currencies }) => {
  const addr0 = ethers.constants.AddressZero
  let totalToWithdraw = 0
  let totalEarned = 0
  let plusTokens = 0
  let cashback = 0

  // TokensQuotes is the last state to be updated, if it is available all other states are available
  if (currencies?.length) {
    currencies.forEach((currency) => {
      // If the currency has been withdrawn, add the amount to the total to withdraw
      if (currency.withdrawn > 0 && currency.quote) {
        const withdrawn =
          currency.id.split("-")[1] == addr0
            ? Number(ethers.utils.formatEther(currency.withdrawn))
            : Number(currency.withdrawn)

        totalEarned += withdrawn * currency.quote
      }

      // If the currency is available to withdrawn, add the amount to the total to withdraw
      if (currency.toWithdraw > 1) {
        const toWithdraw = Number(ethers.utils.formatEther(currency.toWithdraw))

        if (currency.quote) {
          totalToWithdraw += toWithdraw * currency.quote
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
    <div className="relative px-4 pb-16 text-left sm:px-8">
      <div
        className="flex justify-between rounded-lg sm:mb-4 sm:p-0"
        key={totalEarned}
      >
        <div>
          <p className="mb-1 text-gray-500">To withdraw</p>
          <p className="flex gap-1 text-lg font-semibold sm:text-3xl">
            $
            <span className="move-up">
              {currencies ? totalToWithdraw : "..."}
            </span>
          </p>
          {plusTokens > 0 && (
            <p className="pt-1 text-xs text-green-500">
              + tokens
              {/* + {Math.floor(plusTokens * 10000) / 10000} tokens */}
            </p>
          )}
        </div>
        <div>
          <p className="mb-1 text-gray-500">Total earned</p>
          <p className="flex justify-end gap-1 text-lg font-semibold sm:text-3xl">
            $<span className="move-up">{currencies ? totalEarned : "..."}</span>
          </p>
          {/* TODO:  Add SLX Cashback for ToWithdraw amount*/}
          {/* TODO:  Use alchemy erc20 API to fetch SLX received by Juciebox? TBD*/}
          {/* {cashback > 0 && (
            <p className="pt-1 text-xs text-green-500">
              +{cashback} SLX cashback
            </p>
          )} */}
        </div>
      </div>
      <p className="absolute bottom-0 right-0 pr-4 mb-2 text-xs text-right text-gray-500 sm:pr-8">
        SLX cashback fee: 2.5%
      </p>
    </div>
  )
}

export default TotalBalance
