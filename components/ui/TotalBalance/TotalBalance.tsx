import VisibilityOpen from "@components/icons/VisibilityOpen"

type Props = {
  totalEarnedUsd: string
  toWithdrawUsd: string
}

const TotalBalance = ({ totalEarnedUsd, toWithdrawUsd }: Props) => {
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
          {/* <p className="text-xs font-normal text-green-500">+200 tokens</p> */}
        </div>
      </div>
      <p className="p-2 mb-5 text-xs font-normal text-left text-slate-500 ">
        Current SLX cashback fee: 2.5%
      </p>
    </>
  )
}

export default TotalBalance
