import { NextApiRequest, NextApiResponse } from "next"
import corsMiddleware from "@utils/corsMiddleware"
import prisma from "@lib/prisma"

const newCurrency = async (req: NextApiRequest, res: NextApiResponse) => {
  await corsMiddleware(req, res)
  try {
    if (req.method === "POST") {
      const { currencies } = req.body

      const dbCurrencies = currencies.map(
        async ({ id, address, symbol, name, logo, quote }) => {
          await prisma.currency.upsert({
            where: {
              address: address || id.split("-")[1]
            },
            update: {
              symbol,
              name,
              logo,
              quote
            },
            create: {
              address: address || id.split("-")[1],
              symbol,
              name,
              logo,
              quote
            }
          })
        }
      )

      res.status(200).json(dbCurrencies)
    }
  } catch (err) {
    res.status(500).send(err.message)
  }
}

export default newCurrency
