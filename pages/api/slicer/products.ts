import type { NextApiRequest, NextApiResponse } from "next"
import prisma from "@lib/prisma"
import corsMiddleware from "@utils/corsMiddleware"

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  await corsMiddleware(req, res)
  const { list } = req.query
  let data: any

  try {
    if (req.method === "GET" && list) {
      let getProductsBody = []
      const arrayList = String(list).split("_")
      arrayList.forEach((el) => {
        const elements = el.split("-")
        const slicerId = Number(elements[0])
        const productId = Number(elements[1])
        getProductsBody.push({
          AND: [
            {
              slicerId: { equals: slicerId }
            },
            {
              productId: { equals: productId }
            }
          ]
        })
      })

      data = await prisma.product.findMany({
        where: { OR: getProductsBody },
        select: {
          id: true,
          name: true,
          slicerId: true,
          productId: true,
          hash: true,
          image: true,
          purchaseInfo: true,
          uid: true,
          creator: true,
          texts: true
        }
      })
    }

    res.status(200).json(data)
  } catch (err) {
    res.status(500).send(err.message)
  }
}

export default handler
