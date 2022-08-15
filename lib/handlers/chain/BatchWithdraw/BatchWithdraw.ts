import { Signer } from "ethers"

const BatchWithdraw = async (
  signer: Signer,
  account: string,
  currencies: string[]
) => {
  const { fundsModule } = await import("@lib/initProvider")
  const contract = fundsModule(signer)

  try {
    const call = await contract.batchWithdraw(account, currencies)
    return [contract, call]
  } catch (err) {
    throw err
  }
}

export default BatchWithdraw
