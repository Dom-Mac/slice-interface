import type { NextApiRequest, NextApiResponse } from "next"
import prisma from "@lib/prisma"
import { SlicerReduced } from "pages/slicer"
import corsMiddleware from "@utils/corsMiddleware"
import { Currency } from "@prisma/client"
import {
  createOrUpdateCurrencies,
  getCurrenciesMetadata,
  getQuotes
} from "@utils/useCurrenciesData"

type Data =
  | SlicerReduced[]
  | { slicerData: SlicerReduced[]; currencyData: Currency[] }

const handler = async (req: NextApiRequest, res: NextApiResponse<Data>) => {
  const { ids, currencies } = req.query
  await corsMiddleware(req, res)
  try {
    if (req.method === "GET") {
      if (ids) {
        let currencyData: Currency[]
        const idList = String(ids).split("_")

        const slicerData = await prisma.slicer.findMany({
          where: {
            OR: [...idList.map((id) => ({ id: { equals: Number(id) } }))]
          }
        })

        if (currencies) {
          const currencyAddresses = String(currencies).split("_")
          currencyData = await prisma.currency.findMany({
            where: { address: { in: currencyAddresses } }
          })

          if (currencyData.length !== currencyAddresses.length) {
            const metadata = await getCurrenciesMetadata(
              currencyData,
              currencyAddresses
            )
            const missingCurrencies = metadata.filter(
              (el) =>
                currencyData.findIndex((curr) => curr.address == el.address) ==
                -1
            )

            if (missingCurrencies.length) {
              missingCurrencies?.forEach(({ name, symbol, logo, address }) => {
                currencyData.push({
                  id: undefined,
                  address,
                  name,
                  symbol,
                  logo,
                  quote: null,
                  cmcId: null,
                  createdAt: undefined,
                  updatedAt: undefined
                })
              })
            }

            createOrUpdateCurrencies(missingCurrencies)
          }
        }

        res.status(200).json({ slicerData, currencyData })
      } else {
        const slicerList = await prisma.slicer.findMany({
          where: {
            OR: [{ tags: { not: "Private" } }, { tags: { equals: null } }]
          },
          orderBy: { id: "desc" },
          select: {
            id: true,
            name: true,
            tags: true,
            description: true,
            image: true,
            isImmutable: true
          }
        })
        res.status(200).json(slicerList)
      }
    }
  } catch (err) {
    res.status(500).json(err.message)
  }
}

export default handler

// Todo?: Fix cors for !origin? I can access this from anywhere
