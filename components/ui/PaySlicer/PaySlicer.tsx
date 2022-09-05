import { Dispatch, SetStateAction, useEffect, useState } from "react"
import InputPrice from "../InputPrice"
import { useSendTransaction } from "wagmi"
import { BigNumber } from "ethers"
import { useAddRecentTransaction } from "@rainbow-me/rainbowkit"
import { AddressAmount } from "pages/slicer/[id]"
import fetcher from "@utils/fetcher"

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
  const addRecentTransaction = useAddRecentTransaction()
  const [usdValue, setUsdValue] = useState(0)
  const [ethValue, setEthValue] = useState(0)
  const value = BigNumber.from(Math.floor(ethValue * 100000)).mul(
    BigNumber.from(10).pow(13)
  )._hex
  const { data, isIdle, isError, isLoading, sendTransaction } =
    useSendTransaction({
      request: {
        to: slicerAddress,
        value
      },
      onSuccess(data) {
        let newSponsorsList = sponsorsList ? [...sponsorsList] : []

        const index = newSponsorsList.findIndex((el) => el.address == data.from)

        if (index == -1) {
          newSponsorsList.push({ address: data.from, amount: ethValue })
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

// TODO: Figure out why onSuccess is triggered when tx is sent, not when it's successful
