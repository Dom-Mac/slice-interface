import { NextApiRequest, NextApiResponse } from "next"
import corsMiddleware from "@utils/corsMiddleware"
import prisma from "@lib/prisma"

const currencies = async (req: NextApiRequest, res: NextApiResponse) => {
  await corsMiddleware(req, res)
  try {
    if (req.method === "POST") {
      const { currency } = JSON.parse(req.body)
      const dbCurrency = await prisma.currency.findFirst({
        where: { address: currency }
      })

      console.log("Find currency")
      console.log(dbCurrency)

      res.status(200).json(dbCurrency)
    }
  } catch (err) {
    res.status(500).send(err.message)
  }
}

export default currencies
