import { Dispatch, SetStateAction } from "react"
import { Purchase } from "@components/ui/context"
import { ProductCart } from "@lib/handleUpdateCart"

export const getPurchases = async (
  buyer: string,
  setPurchases: Dispatch<SetStateAction<Purchase[]>>
) => {
  const client = (await import("@utils/apollo-client")).default
  const { gql } = await import("@apollo/client")

  const tokensQuery = /* GraphQL */ `
    payee (id: "${buyer.toLowerCase()}") {
      purchases (orderBy: "lastPurchasedAtTimestamp", orderDirection: "desc") {
        id
        totalQuantity
      }
    }`

  const { data } = await client.query({
    query: gql`
      query {
        ${tokensQuery}
      }
    `
  })
  const payeePurchases = data?.payee?.purchases
  let purchasesList: Purchase[] = []
  payeePurchases?.map((p) => {
    const id = p.id.split("-")
    const slicerId = parseInt(id[0], 16).toString()
    const productId = parseInt(id[1], 16).toString()

    purchasesList.push({
      slicerId,
      productId,
      totalQuantity: p.totalQuantity,
      buyerCustomData: []
    })
  })
  setPurchases(purchasesList)
}

export const updatePurchases = (
  cookieCart: ProductCart[],
  purchases: Purchase[]
) => {
  let newPurchases: Purchase[] = []
  cookieCart.map((p) => {
    const index = purchases.findIndex(
      (purchase) =>
        purchase.slicerId == p.slicerId &&
        Number(purchase.productId) == p.productId
    )
    if (index != -1) {
      purchases[index].totalQuantity = String(
        Number(purchases[index].totalQuantity) + Number(p.quantity)
      )
    } else {
      newPurchases.push({
        slicerId: String(p.slicerId),
        productId: String(p.productId),
        totalQuantity: String(p.quantity),
        buyerCustomData: p.buyerCustomData
      })
    }
  })
  return [...newPurchases, ...purchases]
}
