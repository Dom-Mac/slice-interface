import type { NextApiRequest, NextApiResponse } from "next"
import prisma from "@lib/prisma"
import corsMiddleware from "@utils/corsMiddleware"

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  await corsMiddleware(req, res)

  try {
    if (req.method === "POST") {
      const { data } = JSON.parse(req.body)

      const products = await prisma.product.createMany({
        data
      })

      res.status(200).json({ data: products })
    }
  } catch (err) {
    res.status(500).send(err.message)
  }
}

export default handler
