import { useState } from "react"
import { Button, CardImage } from ".."
import { useAppContext } from "../context"
import handleRedeemProduct from "@utils/handleRedeemProduct"
import { useSigner } from "wagmi"

export type RedeemData = {
  quantity: number
  purchaseHash: string
}

type Props = {
  account: string
  dbId: number
  slicerId: number
  productId: number
  name: string
  hash: string
  image: string
  uid: string
  creator: string
  purchaseInfo: string
  texts: {
    thanks?: string
    instructions?: string
  }
  shortcodes: string[]
}

const ProductPurchaseCard = ({
  account,
  dbId,
  slicerId,
  productId,
  name,
  hash,
  image,
  uid,
  creator,
  purchaseInfo,
  texts,
  shortcodes
}: Props) => {
  const { setModalView } = useAppContext()
  const { data: signer } = useSigner()
  const [loading, setLoading] = useState(false)

  return (
    <div className="sm:flex">
      <CardImage
        href={`/slicer/${slicerId}?product=${productId}`}
        name={name}
        imageUrl={image}
        product
      />
      <div className="pt-5 sm:pt-4 sm:ml-6 md:ml-14">
        <div className="flex items-center">
          {name ? (
            <h3 className="inline-block">{name}</h3>
          ) : (
            <div className="w-32 h-6 mb-2 rounded-md bg-sky-300 animate-pulse" />
          )}
          {name && (
            <p className="h-full ml-3 text-sm font-normal text-gray-500">
              {slicerId} / #{productId}
            </p>
          )}
        </div>
        {purchaseInfo != "" ? (
          <div className="text-gray-700">
            <p className="text-sm">
              Contains <b>{purchaseInfo || "..."}</b>
            </p>
          </div>
        ) : null}
        <div className="mt-4">
          <Button
            label={name ? "Redeem" : "Wait..."}
            loading={loading}
            disabled={!name}
            onClick={() =>
              handleRedeemProduct(
                account,
                signer,
                dbId,
                slicerId,
                productId,
                name,
                image,
                uid,
                creator,
                texts,
                setLoading,
                setModalView,
                shortcodes
              )
            }
          />
        </div>
      </div>
    </div>
  )
}

export default ProductPurchaseCard
