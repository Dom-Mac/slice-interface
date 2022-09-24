import { ContractInterface, ethers, Signer } from "ethers"
import constants from "constants"

export type DeployParamsClone = {
  slicerId: number
  args: any[]
}

const clone = async (
  clonerAddress: string,
  abi: ContractInterface,
  signer: Signer,
  deployParams: DeployParamsClone
) => {
  const productsModule =
    constants[process.env.NEXT_PUBLIC_CHAIN_ID][
      process.env.NEXT_PUBLIC_ENVIRONMENT
    ].addresses.ProductsModule

  const { slicerId, args } = deployParams

  try {
    const contract = new ethers.Contract(clonerAddress, abi, signer)

    const call = await contract.clone(productsModule, slicerId, ...args)
    const wait = await call.wait()
    const cloneAddress = wait.events[0].address

    return [cloneAddress, contract, call]
  } catch (err) {
    throw Error()
  }
}

export default clone
