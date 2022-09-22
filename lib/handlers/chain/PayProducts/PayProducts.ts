import { PurchaseParamsStruct } from "types/typechain/ProductsModule"
import { BigNumber, ethers, Signer } from "ethers"
import { ProductCart } from "@lib/handleUpdateCart"

const PayProducts = async (
  signer: Signer,
  buyer: string,
  productData: ProductCart[]
) => {
  const { productsModule, chainlink } = await import("@lib/initProvider")

  const contract = productsModule(signer)
  const priceFeed = await chainlink(signer).latestRoundData()
  const currency = ethers.constants.AddressZero

  const ethUsd = Number(priceFeed[1])
  let totalPrice: BigNumber
  let purchaseParams: PurchaseParamsStruct[] = []

  try {
    productData.forEach((product) => {
      const {
        slicerId,
        productId,
        quantity,
        price,
        isUSD,
        extCallValue,
        buyerCustomData
      } = product
      const currentPrice = totalPrice || 0
      const productPrice = isUSD
        ? BigNumber.from(price)
            .mul(BigNumber.from(10).pow(24))
            .div(ethUsd)
            .add(extCallValue)
        : BigNumber.from(price).add(extCallValue)

      purchaseParams.push({
        slicerId,
        quantity,
        currency,
        productId,
        buyerCustomData
      })
      totalPrice = BigNumber.from(currentPrice).add(productPrice)
    })

    const call = await contract.payProducts(buyer, purchaseParams, {
      value: totalPrice
    })

    return [contract, call]
  } catch (err) {
    console.log(err)

    throw err
  }
}

export default PayProducts

// TODO: Update so currency can be passed here
