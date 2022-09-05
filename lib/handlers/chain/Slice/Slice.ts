import { formatFlags } from "@utils/formatFlags"
import { ethers, Signer } from "ethers"

export type Payee = {
  account: string
  shares: number
  transfersAllowedWhileLocked: boolean
}

const Slice = async (
  signer: Signer,
  payees: Payee[],
  minimumShares: number,
  currencies: string[],
  releaseTimelock: number,
  transferTimelock: number,
  isImmutable: boolean
) => {
  const { sliceCore } = await import("@lib/initProvider")
  const contract = sliceCore(signer)

  const slicerFlags = formatFlags([
    isImmutable
    // controller.currenciesControlled,
    // controller.productsControlled,
    // acceptsAllCurrencies,
  ])
  // const sliceCoreFlags = formatFlags([
  //   isCustomRoyaltyActive,
  //   isRoyaltyReceiverSlicer,
  //   isResliceAllowed,
  //   isControlledTransferAllowed,
  // ])

  try {
    const call = await contract.slice({
      payees,
      minimumShares,
      currencies,
      releaseTimelock,
      transferTimelock,
      controller: ethers.constants.AddressZero,
      slicerFlags,
      sliceCoreFlags: 0
    })

    return [contract, call]
  } catch (err) {
    throw err
  }
}

export default Slice
