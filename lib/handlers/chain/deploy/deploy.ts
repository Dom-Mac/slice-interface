import { ContractInterface, ethers, Signer } from "ethers"

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
  const productsModule = process.env.NEXT_PUBLIC_PRODUCTS_ADDRESS

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
