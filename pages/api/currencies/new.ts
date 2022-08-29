import { NextApiRequest, NextApiResponse } from "next"
import corsMiddleware from "@utils/corsMiddleware"
import prisma from "@lib/prisma"

const newCurrency = async (req: NextApiRequest, res: NextApiResponse) => {
  await corsMiddleware(req, res)
  try {
    if (req.method === "POST") {
      const { currency, name, symbol, logo } = req.body

      const dbCurrency = await prisma.currency.create({
        data: {
          address: currency,
          name,
          symbol,
          logo
        }
      })

      console.log("Create currency")
      console.log(dbCurrency)

      res.status(200).json(dbCurrency)
    }
  } catch (err) {
    res.status(500).send(err.message)
  }
}

export default newCurrency
