import fetcher from "@utils/fetcher"
import useSWR from "swr"
import { useAppContext } from "@components/ui/context"
import Spinner from "@components/icons/Spinner"
import { useEffect, useState } from "react"
import formatNumber from "@utils/formatNumber"

const SlcCounter = () => {
  const { account } = useAppContext()
  const { data } = useSWR(
    account ? `/api/account/${account}/balance` : null,
    fetcher
  )
  const [slc, setSlc] = useState(0)
  const formattedSlc = formatNumber(slc)

  useEffect(() => {
    if (data) {
      setSlc(Number(data.balance.hex) / Math.pow(10, 18))
    }
  }, [data])

  return data ? (
    <p className="text-sm text-black">
      <span className="font-medium">{formattedSlc}</span> SLC
    </p>
  ) : (
    <div className="flex">
      <Spinner />
      <p className="ml-3 text-sm text-black">SLC</p>
    </div>
  )
}

export default SlcCounter
