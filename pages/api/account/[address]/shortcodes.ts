import type { NextApiRequest, NextApiResponse } from "next"
import prisma from "@lib/prisma"
import corsMiddleware from "@utils/corsMiddleware"
import { ReducedShortcode } from "@utils/useDecodeShortcode"

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  await corsMiddleware(req, res)
  const { productId, address, codes } = req.query
  let data: any
  let updateAvailableShortcodes = false

  const codeArr = String(codes).split(",")

  try {
    if (req.method === "GET") {
      const { shortcode } = await prisma.product.findFirst({
        where: { id: { equals: Number(productId) } },
        select: {
          shortcode: true
        }
      })

      const shortcodeId = Number(shortcode.id)
      const availableCodes = shortcode.availableCodes as ReducedShortcode

      data = await prisma.accountCode.findFirst({
        where: {
          AND: [
            {
              shortcodeId: { equals: shortcodeId }
            },
            {
              buyerAddress: { equals: String(address) }
            }
          ]
        },
        select: {
          id: true,
          appliedCodes: true
        }
      })

      // If product hasn't been redeemed yet
      if (!data?.appliedCodes) {
        const appliedCodes = {}

        codeArr.forEach((codeLabel) => {
          const poppedCode = availableCodes[`${codeLabel}`].pop()
          appliedCodes[`${codeLabel}`] = poppedCode
        })

        // Add accountcodes
        data = await prisma.accountCode.create({
          data: {
            shortcodeId: shortcodeId,
            buyerAddress: String(address),
            appliedCodes
          }
        })

        updateAvailableShortcodes = true
      } else {
        const accoundCodeId = Number(data.id)
        const appliedShortcodes: { [k: string]: string } = data.appliedCodes

        codeArr.forEach((codeLabel) => {
          if (
            !appliedShortcodes[`${codeLabel}`] &&
            availableCodes[`${codeLabel}`].length != 0
          ) {
            const poppedCode = availableCodes[`${codeLabel}`].pop()
            appliedShortcodes[`${codeLabel}`] = poppedCode

            updateAvailableShortcodes = true
          }
        })

        if (updateAvailableShortcodes) {
          // Update account shortcodes
          data = await prisma.accountCode.update({
            where: { id: accoundCodeId },
            data: {
              appliedCodes: appliedShortcodes
            }
          })
        }
      }

      if (updateAvailableShortcodes) {
        // Update available shortcodes
        await prisma.shortcode.update({
          where: { id: shortcodeId },
          data: {
            availableCodes
          }
        })
      }
    }

    res.status(200).json({ data })
  } catch (err) {
    res.status(500).send(err.message)
  }
}

export default handler
