import type { NextApiRequest, NextApiResponse } from "next"
import { sliceCore } from "@lib/initProvider"
import { Slicer } from "@prisma/client"
import prisma from "@lib/prisma"
import { defaultProvider } from "lib/useProvider"
import { domain } from "@components/common/Head"
import fetcher from "@utils/fetcher"
import timeout from "@utils/timeout"

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  try {
    if (req.method === "POST") {
      const { id } = req.query
      const {
        slicerAddress,
        isImmutable,
        isCreatorOnly,
        totalShares,
        minimumShares,
        creator
      } = JSON.parse(req.body)
      const baseUrl = process.env.NEXT_PUBLIC_APP_URL

      // Endpoint assumes passed id is hex
      const decimalId = parseInt(String(id), 16)

      const slicerExists: boolean = await sliceCore(defaultProvider).exists(
        decimalId
      )
      let slicerInfo: Slicer

      if (slicerExists) {
        slicerInfo = await prisma.slicer.findFirst({
          where: { id: Number(decimalId) }
        })
        if (slicerInfo == null) {
          slicerInfo = {
            id: Number(decimalId),
            name: `Slicer #${decimalId}`,
            description: "",
            tags: "",
            external_url: `${domain}/slicer/${decimalId}`,
            address: slicerAddress,
            image: "https://slice.so/slicer_default.png",
            isImmutable: isImmutable,
            attributes: [
              {
                display_type: "number",
                trait_type: "Total slices",
                value: String(totalShares)
              },
              {
                display_type: "number",
                trait_type: "Superowner slices",
                value: String(minimumShares)
              },
              {
                trait_type: "Creator",
                value: String(creator).toLowerCase()
              }
            ],
            config: { sponsors: true, creatorOnly: isCreatorOnly },
            sponsors: {}
          }
          await prisma.slicer.create({
            data: slicerInfo
          })

          // On-demand ISR
          const pathToRevalidate1 = `slicer`
          const pathToRevalidate2 = `slicer/${decimalId}`
          await fetcher(
            `${baseUrl}/api/revalidate?secret=${process.env.SECRET_REVALIDATE_TOKEN}&path=${pathToRevalidate1}`
          )
          await timeout(3500)
          await fetcher(
            `${baseUrl}/api/revalidate?secret=${process.env.SECRET_REVALIDATE_TOKEN}&path=${pathToRevalidate2}`
          )
        } else {
          res.status(500).json({ message: "Slicer already exists" })
        }
      } else {
        res.status(404).json({ message: "Slicer does not exist" })
      }
      res.status(200).send({ message: "Slicer created" })
    }
  } catch (err) {
    res.status(500).send(err.message)
  }
}

export default handler
