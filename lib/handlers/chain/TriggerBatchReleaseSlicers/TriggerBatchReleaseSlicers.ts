import { Signer } from "ethers"

const TriggerBatchReleaseSlicers = async (
  signer: Signer,
  slicersAddresses: string[],
  account: string,
  currency: string,
  toWithdraw: boolean
) => {
  // TODO: multicall for different currencies ?
  const { fundsModule } = await import("@lib/initProvider")
  const contract = fundsModule(signer)

  try {
    const call = await contract.batchReleaseSlicers(
      slicersAddresses,
      account,
      currency,
      toWithdraw
    )
    return [contract, call]
  } catch (err) {
    throw err
  }
}

export default TriggerBatchReleaseSlicers
