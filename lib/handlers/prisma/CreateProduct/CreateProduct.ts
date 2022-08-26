const CreateProduct = async (
  slicerId: number,
  name: string,
  shortDescription: string,
  description: string,
  creator: string,
  uid: string,
  hash: string,
  tempProductHash: string,
  image?: string,
  productId?: number | null,
  purchaseInfo?: object,
  texts?: {
    thanks?: string
    instructions?: string
  },
  allowedAddresses?: string[],
  filteredShortcodes?: [string, string[]][]
) => {
  const prisma = (await import("@lib/prisma")).default

  let query
  try {
    query = await prisma.product.create({
      data: {
        slicerId,
        name,
        shortDescription,
        description,
        image,
        creator,
        uid,
        tempProductHash,
        hash,
        productId,
        purchaseInfo,
        texts,
        allowedAddresses
        // version
      }
    })

    if (filteredShortcodes.length != 0) {
      // Format custom shortcodes
      const formattedShortcodes = Object.fromEntries(filteredShortcodes)

      await prisma.shortcode.create({
        data: {
          productId: query.id,
          availableCodes: formattedShortcodes
        }
      })
    }
  } catch (err) {
    console.log(err)
  }

  return query
}

export default CreateProduct
