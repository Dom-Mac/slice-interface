export type Shortcode = {
  [k: string]: {
    label: string
    value: string | string[]
  }
}

export type ReducedShortcode = {
  [k: string]: string[]
}

export const defaultShortcodes = {
  buyerAddress: { label: "Buyer address", value: "" },
  purchasedQuantity: { label: "Purchased quantity", value: "" },
  slicerId: { label: "Slicer ID", value: "" },
  productId: { label: "Product ID", value: "" }
}

const useDecodeShortcode = (
  account: string,
  purchasedQuantity: string,
  slicerId: string,
  productId: string,
  instructions: string,
  accountCodes?: {
    [k: string]: string
  }
) => {
  defaultShortcodes.buyerAddress.value = account
  defaultShortcodes.purchasedQuantity.value = purchasedQuantity
  defaultShortcodes.slicerId.value = slicerId
  defaultShortcodes.productId.value = productId

  Object.entries(defaultShortcodes).map(([key, shortcode]) => {
    instructions = instructions?.replaceAll(`{{${key}}}`, shortcode.value)
  })

  if (accountCodes && JSON.stringify(accountCodes) != "{}") {
    Object.entries(accountCodes).map(([key, val]) => {
      instructions = instructions?.replaceAll(`{{${key}}}`, val)
    })
  }

  return instructions
}

export default useDecodeShortcode
