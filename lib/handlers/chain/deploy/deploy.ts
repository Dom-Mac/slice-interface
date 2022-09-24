import { ContractInterface, ethers, Signer } from "ethers"
import constants from "constants"

export type DeployParamsClone = {
  slicerId: number
  args: any[]
}

const deploy = async (
  factoryAddress: string,
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
    const contract = new ethers.Contract(factoryAddress, abi, signer)

    const call = await contract.deploy(productsModule, slicerId, ...args)
    const wait = await call.wait()
    const contractAddress = wait.events[0].args[0]

    return [contractAddress, contract, call]
  } catch (err) {
    throw Error()
  }
}

export default deploy
