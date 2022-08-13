import { NextApiRequest, NextApiResponse } from "next"
import corsMiddleware from "@utils/corsMiddleware"
import fetcher from "@utils/fetcher"

const getQuotes = async (req: NextApiRequest, res: NextApiResponse) => {
  await corsMiddleware(req, res)
  try {
    if (req.method === "POST") {
      const { tokensMetadata } = JSON.parse(req.body)
      const tokensString = tokensMetadata.map(({ symbol }) => symbol).join(",")

      const cmcUrl = `https://pro-api.coinmarketcap.com/v2/cryptocurrency/quotes/latest?symbol=${tokensString}`
      const token = process.env.COIN_MARKET_CAP_KEY
      const headers = {
        "X-CMC_PRO_API_KEY": token,
        Accept: "application/json"
      }

      const response = await fetcher(cmcUrl, {
        method: "GET",
        headers: headers
      })

      const formattedData = {}

      Object.keys(response.data).forEach((key) => {
        const { quote } = response.data[key][0]
        formattedData[key] = quote.USD.price
      })
      // {ETH: 1986.5684695193536}

      res.status(200).json(formattedData)
    }
  } catch (err) {
    res.status(500).send(err.message)
  }
}

export default getQuotes
