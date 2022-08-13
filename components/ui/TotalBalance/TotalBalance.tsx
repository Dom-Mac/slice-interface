import VisibilityOpen from "@components/icons/VisibilityOpen"
import { ethers } from "ethers"
import { useState } from "react"

const TotalBalance = ({ currencies, tokensMetadata, tokensQuotes }) => {
  const addr0 = ethers.constants.AddressZero
  let totalToWithdraw = 0
  let totalEarned = 0
  let plusTokens = 0
  let cashback = 0

  if (Object.keys(tokensQuotes).length) {
    currencies.forEach((currency, index) => {
      const symbol = tokensMetadata[index]?.symbol
      const usdPrice = tokensQuotes[symbol]
      if (currency.withdrawn > 0 && usdPrice) {
        const withdrawn =
          currency.id.split("-")[1] == addr0
            ? Number(ethers.utils.formatEther(currency.withdrawn))
            : Number(currency.withdrawn)

        totalEarned += withdrawn * usdPrice
      }
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

      if (currency.id.split("-")[1] == addr0) {
        cashback +=
          Number(currency.toPayToProtocol) + Number(currency.paidToProtocol)
      }
    })
    totalToWithdraw = Number(totalToWithdraw.toFixed(2))
    totalEarned = Number(totalEarned.toFixed(2))
  }

  return (
    <>
      <div className="flex items-center mb-4">
        <p className="mr-3 text-lg ">My balance</p>
        <VisibilityOpen className="h-6" />
      </div>
      <div className="flex justify-between w-3/5 p-2 rounded-lg min-w-max bg-slate-800 dark:bg-slate-800">
        <div className="text-left ">
          <p className="text-xs font-normal text-slate-400">Total earned</p>
          <p className="text-lg font-semibold">$ {totalEarned}</p>
          {cashback > 0 && (
            <p className="text-xs font-normal text-green-500">
              +{cashback} SLX cashback
            </p>
          )}
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
