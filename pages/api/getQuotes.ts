import { NextApiRequest, NextApiResponse } from "next"
import corsMiddleware from "@utils/corsMiddleware"
import fetcher from "@utils/fetcher"
import { ethers } from "ethers"

const getQuotes = async (req: NextApiRequest, res: NextApiResponse) => {
  await corsMiddleware(req, res)
  try {
    if (req.method === "POST") {
      const {
        tokens
      }: {
        tokens: { symbol: string; address: string }[]
      } = JSON.parse(req.body)

      const formattedData = {}

      const tokensString = tokens.map(({ symbol }) => symbol).join(",")
      const cmcUrl = `https://pro-api.coinmarketcap.com/v2/cryptocurrency/quotes/latest?symbol=${tokensString}`
      const cmcKey = process.env.COIN_MARKET_CAP_KEY
      const headers = {
        "X-CMC_PRO_API_KEY": cmcKey,
        Accept: "application/json"
      }

      const response = await fetcher(cmcUrl, {
        method: "GET",
        headers: headers
      })

      tokens.forEach((currencyMetadata) => {
        const results = response.data[currencyMetadata.symbol] // array of currencies with the same key
        const currencyAddress = currencyMetadata.address

        if (currencyAddress === ethers.constants.AddressZero) {
          // if it's ETH take the first value of the array
          formattedData[currencyMetadata.symbol] = results[0]?.quote?.USD?.price
        } else {
          results?.forEach((result) => {
            // check if the currency found by symbol has the correct address,
            // otherwise it's not the same currency
            const price =
              result.platform?.token_address?.toLowerCase() ===
              currencyAddress.toLowerCase()
                ? result.quote?.USD.price
                : 0

            formattedData[currencyMetadata.symbol] = price
          })
        }
      })

      res.status(200).json(formattedData)
    }
  } catch (err) {
    console.log(err)
    res.status(500).send(err.message)
  }
}

export default getQuotes
