import { ListLayout, SlicerCard } from "@components/ui"
import { Currency } from "@prisma/client"
import { NewTransaction } from "@rainbow-me/rainbowkit/dist/transactions/transactionStore"
import { BigNumber, BigNumberish } from "ethers"
import { SlicerReduced } from "pages/slicer"
import { useState } from "react"

type Props = {
  account: string
  payeeData: any
  slicers: any
  loading: boolean
  unreleasedData: BigNumberish[]
  addRecentTransaction: (transaction: NewTransaction) => void
  dbData?: { slicerData: SlicerReduced[]; currencyData: Currency[] }
}

const SlicersList = ({
  account,
  payeeData,
  slicers,
  loading,
  unreleasedData,
  addRecentTransaction,
  dbData
}: Props) => {
  const [iterator, setIterator] = useState(0)
  const unreleasedDataCopy = unreleasedData && [...unreleasedData]
  const { slicerData, currencyData } = dbData || {}

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
          const currencies = slicer?.currencies
          const unreleasedAmounts = unreleasedDataCopy
            ?.splice(0, currencies.length)
            .map((amount, i) => {
              const currencyAddress = currencies[i].id.split("-")[0]

              return {
                currency: currencyAddress,
                amount: amount as BigNumber,
                symbol: currencyData?.find(
                  (currency) => currency.address == currencyAddress
                )?.symbol
              }
            })
          const dbData = slicerData?.find((el) => el.id == slicerId)

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
                unreleasedAmounts={unreleasedAmounts}
                addRecentTransaction={addRecentTransaction}
                dbData={dbData}
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
