import { NextApiRequest, NextApiResponse } from "next"
import corsMiddleware from "@utils/corsMiddleware"
import fetcher from "@utils/fetcher"

const getQuotes = async (req: NextApiRequest, res: NextApiResponse) => {
  await corsMiddleware(req, res)
  try {
    if (req.method === "POST") {
      const { tokens } = JSON.parse(req.body)
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

      res.status(200).json(response)
    }
  } catch (err) {
    console.log(err)
    res.status(500).send(err.message)
  }
}

export default getQuotes
