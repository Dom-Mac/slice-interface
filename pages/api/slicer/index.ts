import type { NextApiRequest, NextApiResponse } from "next"
import prisma from "@lib/prisma"
import { SlicerReduced } from "pages/slicer"
import corsMiddleware from "@utils/corsMiddleware"
import { Currency } from "@prisma/client"
import {
  createOrUpdateCurrencies,
  getCurrenciesMetadata,
  getQuotes,
  getQuotesToBeUpdated
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
        let currencyData: Currency[] = []
        const idList = String(ids).split("_")

        const slicerData = await prisma.slicer.findMany({
          where: {
            OR: [...idList.map((id) => ({ id: { equals: Number(id) } }))]
          }
        })

        if (currencies) {
          const currencyAddresses = String(currencies).split("_")
          const dbCurrencies = await prisma.currency.findMany({
            where: { address: { in: currencyAddresses } }
          })

          if (dbCurrencies.length === currencyAddresses.length) {
            let quotes = {}
            // check if there are quotes to be updated
            const quotesToBeUpdated = getQuotesToBeUpdated(dbCurrencies)
            // if there are tokens to be updated, get quotes from coin market cap
            if (quotesToBeUpdated.length) {
              quotes = await getQuotes(dbCurrencies)
            }

            // format data
            currencyAddresses?.forEach((address) => {
              const dbCurrency = dbCurrencies.find(
                (dbCurrency) => address === dbCurrency.address
              )

              const { name, symbol, logo, quote } = dbCurrency
              currencyData.push({
                ...dbCurrency,
                address,
                name,
                symbol,
                logo,
                // if the quotes have been updated return the new value, else return the db value
                quote: Object.keys(quotes).length ? quotes[symbol] : quote
              })
            })

            if (quotesToBeUpdated.length) {
              createOrUpdateCurrencies(currencyData)
            }
          } else {
            const metadata = await getCurrenciesMetadata(
              dbCurrencies,
              currencyAddresses
            )
            const quotes = await getQuotes(metadata)

            metadata?.forEach(({ name, symbol, logo, address }) => {
              currencyData.push({
                id: undefined,
                address,
                name,
                symbol,
                logo,
                quote: quotes[symbol],
                cmcId: null,
                createdAt: undefined,
                updatedAt: undefined
              })
            })

            createOrUpdateCurrencies(currencyData)
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
