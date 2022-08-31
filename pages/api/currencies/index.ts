import { NextApiRequest, NextApiResponse } from "next"
import corsMiddleware from "@utils/corsMiddleware"
import prisma from "@lib/prisma"

const currencies = async (req: NextApiRequest, res: NextApiResponse) => {
  await corsMiddleware(req, res)
  try {
    if (req.method === "POST") {
      const { currencies } = req.body
      const dbCurrencies = await prisma.currency.findMany({
        where: { address: { in: currencies } }
      })

      res.status(200).json(dbCurrencies)
    }
  } catch (err) {
    res.status(500).send(err.message)
  }
}

export default currencies
