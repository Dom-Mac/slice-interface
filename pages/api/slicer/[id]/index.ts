import type { NextApiRequest, NextApiResponse } from "next"
import { sliceCore } from "@lib/initProvider"
import { Slicer } from "@prisma/client"
import prisma from "@lib/prisma"
import { defaultProvider } from "lib/useProvider"
import client from "@utils/apollo-client"
import { gql } from "@apollo/client"
import { domain } from "@components/common/Head"
import getEthFromWei from "@utils/getEthFromWei"
import { BigNumber, utils } from "ethers"

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  const { id, stats } = req.query

  const hexId = utils.hexValue(BigNumber.from(parseInt(String(id), 16)))

  // Endpoint assumes passed id is hex
  const decimalId = parseInt(String(id), 16)

  try {
    if (req.method === "GET") {
      const slicerExists: boolean = await sliceCore(defaultProvider).exists(
        decimalId
      )
      let slicerInfo: Slicer

      if (slicerExists) {
        slicerInfo = await prisma.slicer.findFirst({
          where: { id: Number(decimalId) }
        })
        if (slicerInfo == null) {
          const { data } = await client.query({
            query: gql`
              query Slicers {
                slicer(id: "${hexId}") {
                  address
                  slices
                  minimumSlices
                  isImmutable
                  creator{
                    id
                  }
                  createdAtTimestamp
                }
              }
            `
          })
          const creatorAddress = data.slicer.creator.id
          // const creatorAddressFormatted = creatorAddress.replace(
          //   creatorAddress.substring(5, creatorAddress.length - 3),
          //   "___"
          // )

          slicerInfo = {
            id: Number(decimalId),
            name: `Slicer #${decimalId}`,
            description: "",
            tags: "",
            external_url: `${domain}/slicer/${decimalId}`,
            address: data.slicer.address,
            image: "https://slice.so/slicer_default.png",
            isImmutable: data.slicer.isImmutable,
            attributes: [
              {
                display_type: "number",
                trait_type: "Total slices",
                value: data.slicer.slices
              },
              {
                display_type: "number",
                trait_type: "Superowner slices",
                value: data.slicer.minimumSlices
              },
              {
                trait_type: "Creator",
                value: creatorAddress
                // value: creatorAddressFormatted,
              },
              {
                display_type: "date",
                trait_type: "Sliced on",
                value: data.slicer.createdAtTimestamp
              }
            ],
            config: { sponsors: true },
            sponsors: {}
          }
          await prisma.slicer.create({
            data: slicerInfo
          })
        }
        if (slicerInfo?.attributes?.length == 3) {
          const attributes = slicerInfo.attributes

          const { data } = await client.query({
            query: gql`
              query Slicers {
                slicer(id: "${hexId}") {
                  createdAtTimestamp
                }
              }
            `
          })
          if (data?.slicer?.createdAtTimestamp) {
            attributes.push({
              display_type: "date",
              trait_type: "Sliced on",
              value: data.slicer.createdAtTimestamp
            })
          }
          await prisma.slicer.update({
            where: { id: Number(decimalId) },
            data: { attributes }
          })
        }
        if (stats !== "false") {
          // const { data } = await client.query({
          //   query: gql`
          //     query Slicers {
          //       slicer(id: "${hexId}") {
          //         ethReceived
          //       }
          //     }
          //   `
          // })
          // // TODO: Switch this query from subgraph to Alchemy tokenAPI
          // const totalReceived = getEthFromWei(data.slicer.ethReceived, true)
          // slicerInfo.attributes.push({
          //   display_type: "number",
          //   trait_type: "ETH Received",
          //   value: totalReceived || "0"
          // })
        }
      } else {
        slicerInfo = {
          id: null,
          name: "",
          description: "",
          tags: "",
          external_url: "",
          address: "",
          image: "",
          isImmutable: false,
          attributes: [],
          config: { sponsors: true },
          sponsors: {}
        }
      }
      res.status(200).json(slicerInfo)
    }

    if (req.method === "POST") {
      const { name, tags, description, imageUrl } = JSON.parse(req.body)

      const slicerInfo = await prisma.slicer.findFirst({
        where: { id: Number(decimalId) },
        select: {
          isImmutable: true,
          id: true,
          name: true,
          tags: true,
          description: true,
          image: true
        }
      })

      if (
        slicerInfo.isImmutable &&
        slicerInfo.name !== `Slicer #${decimalId}` &&
        slicerInfo.description !== "" &&
        slicerInfo.tags !== "" &&
        slicerInfo.image !== "https://slice.so/slicer_default.png"
      ) {
        throw Error("Collectible asset already set")
      }

      const query = await prisma.slicer.update({
        where: { id: Number(decimalId) },
        data: { name, tags, description, image: imageUrl }
      })
      res.status(200).json({ query })
    }
  } catch (err) {
    res.status(500).send(err.message)
  }
}

export default handler
