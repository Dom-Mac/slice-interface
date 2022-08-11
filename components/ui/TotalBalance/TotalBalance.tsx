import VisibilityOpen from "@components/icons/VisibilityOpen"
import { ethers } from "ethers"

type Props = {
  currencies: any[]
  ethUsd: any
}

const TotalBalance = ({ currencies, ethUsd }) => {
  const addrO = ethers.constants.AddressZero
  const ethBalance = currencies?.filter((c) => c.id.split("-")[1] == addrO)[0]
  const withdrawnEth = ethers.utils.formatEther(ethBalance?.withdrawn || 0)
  const toWithdrawEth = ethers.utils.formatEther(ethBalance?.toWithdraw || 0)
  const totalEarnedEth = Number(withdrawnEth) + Number(toWithdrawEth)
  // Conversion in USD
  const totalEarnedUsd = (totalEarnedEth * Number(ethUsd?.price)).toFixed(2)
  const toWithdrawUsd = (Number(toWithdrawEth) * Number(ethUsd?.price)).toFixed(
    2
  )
  // const otherTokens = currencies?.filter((c) => c.id.split("-")[1] != addrO)
  const otherTokens = [1]

  return (
    <>
      <div className="flex items-center mb-4">
        <p className="mr-3 text-lg ">My balance</p>
        <VisibilityOpen className="h-6" />
      </div>
      <div className="flex justify-between w-3/5 p-2 rounded-lg min-w-max bg-slate-800 dark:bg-slate-800">
        <div className="text-left ">
          <p className="text-xs font-normal text-slate-400">Total earned</p>
          <p className="text-lg font-semibold">$ {totalEarnedUsd}</p>
          {/* <p className="text-xs font-normal text-green-500">
        +200 SLX cashback
      </p> */}
        </div>
        <div className="text-left ">
          <p className="text-xs font-normal text-slate-400">To withdraw</p>
          <p className="text-lg font-semibold">$ {toWithdrawUsd}</p>
          {otherTokens.length > 0 && (
            <p className="text-xs font-normal text-green-500">
              +{otherTokens.length} token{otherTokens.length > 1 ? "s" : null}
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
