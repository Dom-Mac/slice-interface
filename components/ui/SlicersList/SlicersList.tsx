import { ListLayout, SlicerCard } from "@components/ui"
import { useEffect, useState } from "react"

type Props = {
  account: string
  payeeData: any
  slicers: any
  loading: boolean
}

const SlicersList = ({ account, payeeData, slicers, loading }: Props) => {
  const [iterator, setIterator] = useState(0)
  const [unreleased, setUnreleased] = useState([])
  let slicerAddresses = []

  const getUnreleasedData = async (data) => {
    const fetcher = (await import("@utils/fetcher")).default

    const unreleasedData = await fetcher(
      `/api/account/${account}/unreleased`,
      data
    )
    setUnreleased(unreleasedData)
  }

  useEffect(() => {
    if (account && slicers) {
      slicers?.map((slicer) => {
        slicerAddresses.push(slicer.slicer.address)
      })
      const body = {
        method: "POST",
        body: JSON.stringify({ slicerAddresses })
      }
      getUnreleasedData(body)
    }
    return () => setUnreleased([])
  }, [slicers, account])

  return (
    <ListLayout
      elementsArray={!loading && (slicers || [])}
      setIterator={setIterator}
      actionScreenText="You have no slicers :("
      actionScreenHref="/slice"
      actionScreenButtonLabel="Start slicing"
      endpageButtonLabel="Create a new slicer"
      wrapperClassName="space-y-20 sm:space-y-28"
    >
      <>
        {[...Array(iterator)].map((el, key) => {
          const i = Number(key)
          const slicerOwned = slicers && slicers[i]
          const ownedShares = slicerOwned?.slices
          const slicer = slicerOwned?.slicer
          const slicerId = parseInt(String(slicer?.id), 16)
          const totalSlices = slicer?.slices
          const slicerAddress = slicer?.address
          const isImmutable = slicer?.isImmutable
          const protocolFee = slicer?.protocolFee
          const productsModuleBalance = slicer?.productsModuleBalance
          const isAllowed = Number(ownedShares) >= Number(slicer?.minimumSlices)
          const unreleasedAmount = unreleased[i]

          return (
            <div className="mt-3" key={key}>
              <SlicerCard
                slicerAddress={slicerAddress}
                slicerId={slicerId}
                account={account}
                shares={ownedShares}
                totalSlices={totalSlices}
                protocolFee={Number(protocolFee)}
                isAllowed={isAllowed}
                isImmutable={isImmutable}
                productsModuleBalance={productsModuleBalance}
                unreleasedAmount={unreleasedAmount}
              />
            </div>
          )
        })}
      </>
    </ListLayout>
  )
}

export default SlicersList

// Todo: Add sorting options, if possible also by unreleased amount
// Todo: Unrelease batch
