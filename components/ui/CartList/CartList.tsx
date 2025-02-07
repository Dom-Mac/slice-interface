import { CookieSetOptions } from "universal-cookie"
import { ProductCart } from "@lib/handleUpdateCart"
import { ListCard } from ".."
import { utils } from "ethers"

type Props = {
  cookieCart: ProductCart[]
  ethUsd: number
  setCookie: (name: "cart", value: any, options?: CookieSetOptions) => void
}

const CartList = ({ cookieCart, ethUsd, setCookie }: Props) => {
  return (
    <div className="p-3 space-y-3 shadow-lg bg-gray-300 bg-opacity-30 backdrop-blur-md rounded-xl max-h-[300px] sm:max-h-[450px] w-[21rem] sm:w-[22rem] overflow-y-scroll">
      {cookieCart?.map((product, key) => {
        const {
          slicerId,
          slicerAddress,
          productId,
          quantity,
          price,
          isUSD,
          extCallValue,
          name,
          externalAddress,
          path
        } = product
        const productPrice = isUSD
          ? Math.floor(Number(price) / (ethUsd * 100)) / 10000
          : Math.floor(Number(price) / 10 ** 14) / 10000
        const externalCallEth = utils.formatEther(extCallValue)

        const index = cookieCart.findIndex(
          (p: ProductCart) =>
            p.productId == productId && p.slicerAddress == slicerAddress
        )

        const handleRemove = () => {
          const newCookies = cookieCart
          newCookies.splice(index, 1)
          setCookie("cart", newCookies)
        }

        const formattedPrice =
          Math.floor((Number(productPrice) + Number(externalCallEth)) * 10000) /
          10000

        return (
          <ListCard
            key={key}
            label={name}
            sideLabel={`${slicerId} / #${productId}`}
            subLabel={`Ξ ${formattedPrice}${
              quantity != 1 ? ` (${quantity})` : ""
            }`}
            href={`/slicer/${path}?product=${productId}`}
            remove={() => handleRemove()}
            externalAddress={externalAddress}
          />
        )
      })}
    </div>
  )
}

export default CartList
