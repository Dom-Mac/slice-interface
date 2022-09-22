import { ReducedShortcode } from "@utils/useDecodeShortcode"
import { useRouter } from "next/dist/client/router"
import { BlockchainProduct } from "pages/slicer/[id]"
import { useEffect, useState } from "react"
import { ProductsGrid } from ".."
import Button from "../Button"

export type Product = {
  id: number
  productId: number
  name: string
  shortDescription: string
  description: string
  creator: string
  hash: string
  image: string
  uid: string
  purchaseInfo: {
    files: boolean
    instructions: boolean
    notes: boolean
    shortcodes: string[]
  }
  texts: {
    thanks?: string
    instructions?: string
  }
  allowedAddresses: string[]
}

type Props = {
  account: string
  isAllowed: string
  slicerId: string
  slicerAddress: string
  products: any
  blockchainProducts: BlockchainProduct[]
  editMode: boolean
}

const SlicerProducts = ({
  account,
  isAllowed,
  slicerId,
  slicerAddress,
  products,
  blockchainProducts,
  editMode
}: Props) => {
  const [showProducts, setShowProducts] = useState<Product[]>([])
  const [pendingProducts, setPendingProducts] = useState<Product[]>([])
  const [subgraphRefresh, setSubgraphRefresh] = useState(false)
  const [loading, setLoading] = useState(false)
  const router = useRouter()

  const handleReload = async () => {
    const fetcher = (await import("@utils/fetcher")).default
    const { handleCleanup, reload } = await import("@lib/handleCreateProduct")

    try {
      if (pendingProducts?.length != 0) {
        await handleCleanup(Number(slicerId), setLoading)
      } else {
        await reload(Number(slicerId), setLoading)
      }
      await fetcher(`/api/slicer/${slicerId}/refresh`)
    } catch (err) {
      console.log(err)
    }
    router.reload()
  }

  const refreshProducts = async () => {
    setLoading(true)
    const fetcher = (await import("@utils/fetcher")).default
    try {
      await fetcher(`/api/slicer/${slicerId}/refresh`)
    } catch (err) {
      console.log(err)
    }
    setLoading(false)
    router.reload()
  }

  useEffect(() => {
    const productsToShow = products?.data?.filter(
      (p: Product) => p.productId != null
    )
    setShowProducts(productsToShow)
    setSubgraphRefresh(
      productsToShow?.filter(
        (product: Product) =>
          !blockchainProducts?.find(
            (p) => Number(p.id.split("-").pop()) == product?.productId
          )
      ).length != 0
    )
    setPendingProducts(products?.data?.filter((p: Product) => !p.productId))
  }, [products])

  return (
    <>
      <ProductsGrid
        slicerId={Number(slicerId)}
        slicerAddress={slicerAddress}
        blockchainProducts={blockchainProducts}
        products={showProducts}
        editMode={editMode}
      />
      {(isAllowed == "product" || isAllowed == "full") && (
        <div>
          {!editMode && (
            <div className="pt-6">
              <Button
                label="Add a new product"
                href={`${slicerId}/products/new`}
              />
            </div>
          )}
          {subgraphRefresh ? (
            <>
              <hr className="w-20 mx-auto mt-16 mb-12 border-gray-300" />
              <p className="pb-8 font-semibold text-yellow-600">
                Some product info has to be retrieved from the blockchain.
              </p>
              <Button
                label="Refresh products"
                type="button"
                loading={loading}
                onClick={async () => await refreshProducts()}
              />
            </>
          ) : (
            (pendingProducts?.length != 0 ||
              blockchainProducts?.length > products?.data?.length) && (
              <>
                <hr className="w-20 mx-auto mt-16 mb-12 border-gray-300" />
                <p className="pb-8 font-semibold text-yellow-600">
                  There are pending products for your slicer.
                </p>
                <Button
                  label="Reload products"
                  type="button"
                  loading={loading}
                  onClick={async () => await handleReload()}
                />
              </>
            )
          )}
          <hr className="w-20 mx-auto mt-16 border-gray-300" />
        </div>
      )}
    </>
  )
}

export default SlicerProducts

// TODO: Make pendingSlicer section appear only if 15 minutes have elapsed (??)

// TODO: Detect removed products for refresh/reload button (already done??)
