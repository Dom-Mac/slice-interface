import { Dispatch, SetStateAction, useEffect, useState } from "react"
import InputPrice from "../InputPrice"
import { useSendTransaction, usePrepareSendTransaction } from "wagmi"
import { BigNumber } from "ethers"
import { useAddRecentTransaction } from "@rainbow-me/rainbowkit"
import { AddressAmount } from "pages/slicer/[id]"
import fetcher from "@utils/fetcher"
import { useAppContext } from "../context"

type Props = {
  slicerId: string
  slicerAddress: string
  sponsorsList: AddressAmount[]
  setSponsorsList: Dispatch<SetStateAction<AddressAmount[]>>
}

const PaySlicer = ({
  slicerId,
  slicerAddress,
  sponsorsList,
  setSponsorsList
}: Props) => {
  const { account } = useAppContext()
  const addRecentTransaction = useAddRecentTransaction()
  const [usdValue, setUsdValue] = useState(0)
  const [ethValue, setEthValue] = useState(0)
  const value = BigNumber.from(Math.floor(ethValue * 100000)).mul(
    BigNumber.from(10).pow(13)
  )._hex
  const { config } = usePrepareSendTransaction({
    request: { to: slicerAddress, value }
  })
  const { data, isLoading, sendTransaction } = useSendTransaction({
    ...config,
    onSettled() {
      let newSponsorsList = sponsorsList ? [...sponsorsList] : []

      const index = newSponsorsList.findIndex((el) => el.address == account)

      if (index == -1) {
        newSponsorsList.push({ address: account, amount: ethValue })
      } else {
        newSponsorsList[index].amount += Number(ethValue)
      }

      setSponsorsList(newSponsorsList.sort((a, b) => b.amount - a.amount))
      setEthValue(0)
      setUsdValue(0)

      setTimeout(() => {
        fetcher(`/api/slicer/${slicerId}/refresh`)
      }, 15000)
    }
  })

  useEffect(() => {
    if (data?.hash) {
      addRecentTransaction({
        hash: data.hash,
        description: `Send ETH to Slicer`
      })
    }
  }, [data])

  return (
    <InputPrice
      ethValue={ethValue}
      setEthValue={setEthValue}
      usdValue={usdValue}
      setUsdValue={setUsdValue}
      loading={isLoading}
      actionLabel="Send"
      marginLabel="mr-32"
      action={() => sendTransaction()}
    />
  )
}

export default PaySlicer
