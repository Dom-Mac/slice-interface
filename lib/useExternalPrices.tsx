import { useEffect, useState } from "react"
import multicall from "@utils/multicall"
import formatCalldata from "@utils/formatCalldata"
import { ethers } from "ethers"
import { BlockchainProduct } from "pages/slicer/[id]"
import constants from "constants"

export const getExternalPrices = async (
  args: string[],
  ids: [number, number][]
) => {
  const returnedPrices = {}
  const result = await multicall(
    constants[process.env.NEXT_PUBLIC_CHAIN_ID][
      process.env.NEXT_PUBLIC_ENVIRONMENT
    ].addresses.ProductsModule,
    "productPrice(uint256,uint256,address,uint256,address,bytes)",
    args,
    false
  )

  ids.forEach(([slicerId, productId], i) => {
    if (result[i]) {
      const [ethPrice, currencyPrice] = [
        result[i].slice(2, 66),
        result[i].slice(66)
      ]
      if (!returnedPrices[slicerId]) returnedPrices[slicerId] = {}
      returnedPrices[slicerId][productId] = {
        [ethers.constants.AddressZero]: {
          ethPrice,
          currencyPrice
        }
      }
    }
  })

  return returnedPrices
}

const formatArgs = (
  account: string,
  blockchainProducts: BlockchainProduct[]
) => {
  const ids = []
  const args = []

  if (blockchainProducts) {
    blockchainProducts.forEach((product) => {
      if (
        product.prices.length != 0 &&
        product.prices[0].externalAddress != "0x00000000" &&
        product.prices[0].externalAddress != ethers.constants.AddressZero
      ) {
        const [slicerId, productId] = product.id.split("-")
        ids.push([Number(slicerId), Number(productId)])
        args.push(
          formatCalldata(
            slicerId,
            productId,
            ethers.constants.AddressZero,
            "0x1",
            account || ethers.constants.AddressZero,
            "0x"
          )
        )
      }
    })
  }

  return [ids, args]
}

const useExternalPrices = (account: string, products: any) => {
  const [prices, setPrices] = useState({})

  useEffect(() => {
    const [ids, args] = formatArgs(account, products)

    const getPrices = async () => {
      setPrices(await getExternalPrices(args, ids))
    }

    if (args.length != 0) {
      if (Object.keys(prices).length == 0) {
        getPrices()
      }

      const intervalId = setInterval(() => {
        getPrices()
      }, 24000)

      return () => {
        clearInterval(intervalId)
      }
    }
  }, [products])

  return prices
}

export default useExternalPrices

// TODO: FIX cart button not disappearing in products with invalid dynamic price (not here)
