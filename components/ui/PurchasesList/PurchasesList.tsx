import { Product } from ".prisma/client"
import { ListLayout, ProductPurchaseCard } from "@components/ui"
import { Purchase, useAppContext } from "@components/ui/context"
import fetcher from "@utils/fetcher"
import { useEffect, useState } from "react"
import useSWR from "swr"

const PurchasesList = () => {
  const { account, purchases } = useAppContext()
  const [purchaseQuery, setPurchaseQuery] = useState("")
  const [iterator, setIterator] = useState(0)

  const { data: purchaseData } = useSWR(
    purchaseQuery ? `/api/slicer/products?list=${purchaseQuery}` : null,
    fetcher
  )

  useEffect(() => {
    if (purchases) {
      let queryString = ""
      purchases.forEach((purchase: Purchase) => {
        const { slicerId, productId } = purchase
        queryString += `${slicerId}-${productId}_`
      })
      const formattedQuery = queryString.substring(0, queryString.length - 1)
      setPurchaseQuery(formattedQuery)
    }
  }, [purchases])

  return (
    <ListLayout
      elementsArray={purchases}
      setIterator={setIterator}
      actionScreenText="You haven't purchased anything yet"
      actionScreenHref="/slicer"
      actionScreenButtonLabel="Browse slicers"
      wrapperClassName="space-y-20 sm:space-y-28"
    >
      <>
        {[...Array(iterator)].map((el, key) => {
          const i = Number(key)
          const purchase = purchases && purchases[i]
          const index = purchaseData?.findIndex(
            (p: Product) =>
              p.slicerId == purchase?.slicerId &&
              p.productId == purchase?.productId
          )
          const purchaseDataEl = purchaseData && purchaseData[index]

          const slicerId = purchase?.slicerId
          const productId = purchase?.productId
          const dbId = purchaseDataEl?.id
          const name = purchaseDataEl?.name
          const hash = purchaseDataEl?.hash
          const image = purchaseDataEl?.image
          const uid = purchaseDataEl?.uid
          const creator = purchaseDataEl?.creator
          const texts = purchaseDataEl?.texts
          const purchaseElArray =
            purchaseDataEl &&
            Object.keys(purchaseDataEl?.purchaseInfo).filter(
              (el) => purchaseDataEl?.purchaseInfo[el] == true
            )
          const purchaseInfo = purchaseElArray?.join(", ") || ""

          return (
            <div className="mt-3" key={key}>
              <ProductPurchaseCard
                dbId={dbId}
                account={account}
                slicerId={slicerId}
                productId={productId}
                name={
                  index != -1 ? name : `Product ${slicerId} / #${productId}`
                }
                hash={hash}
                image={image}
                uid={uid}
                creator={creator}
                purchaseInfo={purchaseInfo}
                texts={texts}
                shortcodes={purchaseDataEl?.purchaseInfo?.shortcodes || []}
              />
            </div>
          )
        })}
      </>
    </ListLayout>
  )
}

export default PurchasesList
