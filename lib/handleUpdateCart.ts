import saEvent from "@utils/saEvent"
import { BytesLike, ethers } from "ethers"
import { CookieSetOptions } from "universal-cookie"

export type ProductCart = {
  slicerId: number
  slicerAddress: string
  productId: number
  quantity: number
  price: string
  isUSD: boolean
  extCallValue: number
  buyerCustomData: BytesLike
  name: string
  externalAddress: string
}

const handleUpdateCart = async (
  cookies: {
    cart?: any
  },
  setCookie: (name: "cart", value: any, options?: CookieSetOptions) => void,
  productCart: ProductCart,
  slicerId: number,
  slicerAddress: string,
  productId: number,
  price: string,
  isUSD: boolean,
  extCallValue: string,
  buyerCustomData: BytesLike,
  name: string,
  newQuantity: number,
  externalAddress?: string
) => {
  const newCookies = cookies?.cart || []
  const formattedAddress =
    externalAddress &&
    externalAddress != "0x00000000" &&
    externalAddress != ethers.constants.AddressZero
      ? externalAddress
      : ethers.constants.AddressZero

  if (newQuantity > 0) {
    saEvent("add_product_to_cart")
  } else {
    saEvent("remove_product_from_cart")
  }
  if (newCookies.length != 0 && productCart) {
    const quantity = productCart.quantity + newQuantity
    const index = newCookies.findIndex(
      (p: ProductCart) =>
        p.productId == productId && p.slicerAddress == slicerAddress
    )
    if (quantity > 0) {
      newCookies[index] = {
        slicerId,
        slicerAddress,
        productId,
        quantity,
        price: price ? String(Number(price) * quantity) : "0",
        isUSD,
        extCallValue: String(Number(extCallValue) * quantity),
        buyerCustomData,
        name,
        externalAddress: formattedAddress
      }
    } else {
      newCookies.splice(index, 1)
    }
  } else if (newQuantity > 0) {
    const quantity = newQuantity
    newCookies.push({
      slicerId,
      slicerAddress,
      productId,
      quantity,
      price: price ? String(Number(price) * quantity) : "0",
      isUSD,
      extCallValue: String(Number(extCallValue) * quantity),
      buyerCustomData,
      name,
      externalAddress: formattedAddress
    })
  }
  setCookie("cart", newCookies)
}

export default handleUpdateCart
