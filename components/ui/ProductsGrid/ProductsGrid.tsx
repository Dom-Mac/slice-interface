import fetcher from "@utils/fetcher"
import { useRouter } from "next/router"
import { useState } from "react"
import useSWR from "swr"
import { ProductCard } from ".."
import { Product } from "../SlicerProducts/SlicerProducts"

type Props = {
  slicerId: number
  slicerAddress: string
  products: Product[]
  editMode: boolean
  blockchainProducts: any
}

const ProductsGrid = ({
  slicerId,
  slicerAddress,
  products,
  editMode,
  blockchainProducts
}: Props) => {
  const router = useRouter()
  const { product: productQuery } = router.query
  const increment = 6
  const [visibleItems, setVisibleItems] = useState(increment)

  const { data: ethUsd } = useSWR(
    "https://api.binance.com/api/v3/ticker/price?symbol=ETHUSDT",
    fetcher
  )

  const productQueryData = products?.find(
    (p) => p.productId == Number(productQuery)
  )

  return blockchainProducts && blockchainProducts.length != 0 ? (
    <>
      <h2 className="pb-6">Products</h2>
      <div className="grid items-center justify-center grid-cols-1 gap-8 max-w-[400px] mx-auto sm:max-w-none sm:grid-cols-2">
        {products.slice(0, visibleItems).map((product) => {
          const chainInfo = blockchainProducts?.find(
            (p) => p.id.split("-").pop() == product?.productId
          )
          const displayProduct =
            productQueryData && Number(productQuery) == product?.productId

          return (
            <ProductCard
              slicerId={slicerId}
              slicerAddress={slicerAddress}
              key={product.id}
              product={product}
              chainInfo={chainInfo}
              editMode={editMode}
              ethUsd={ethUsd}
              displayProduct={displayProduct}
            />
          )
        })}
      </div>
      {visibleItems < products?.length && (
        <p className="py-6 text-center">
          <a onClick={() => setVisibleItems(visibleItems + increment)}>
            Load more
          </a>
        </p>
      )}
    </>
  ) : null
}

export default ProductsGrid

// TODO: Remove `displayProduct` logic when product page is done
