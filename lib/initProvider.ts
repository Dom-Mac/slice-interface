import { ethers } from "ethers"
import SliceCoreContract from "artifacts/contracts/SliceCore.sol/SliceCore.json"
import ProductsModuleContract from "artifacts/contracts/ProductsModule.sol/ProductsModule.json"
import FundsModuleContract from "artifacts/contracts/FundsModule.sol/FundsModule.json"
import SlicerContract from "artifacts/contracts/Slicer.sol/Slicer.json"
import jbPayerContract from "artifacts/contracts/JBETHERC20ProjectPayerTokensReceiverCloneDeployer.sol/JBETHERC20ProjectPayerTokensReceiverCloneDeployer.json"
import ChainlinkContract from "artifacts/@chainlink/contracts/src/v0.8/interfaces/AggregatorV3Interface.sol/AggregatorV3Interface.json"
import { SliceCore } from "../types/typechain/SliceCore"
import { ProductsModule } from "../types/typechain/ProductsModule"
import { FundsModule } from "../types/typechain/FundsModule"
import { Slicer } from "../types/typechain/Slicer"
import { JBETHERC20ProjectPayerTokensReceiverCloneDeployer } from "../types/typechain/JBETHERC20ProjectPayerTokensReceiverCloneDeployer"
import constants from "../constants.json"

const {
  SliceCore: sliceCoreAddress,
  ProductsModule: productsModuleAddress,
  FundsModule: fundsModuleAddress,
  ChainlinkFeed: chainlinkFeedAddress,
  DeployCloneFactory: deployCloneFactoryAddress
} = constants[process.env.NEXT_PUBLIC_CHAIN_ID][
  process.env.NEXT_PUBLIC_ENVIRONMENT
].addresses

export const sliceCore = (signer: ethers.Signer | ethers.providers.Provider) =>
  new ethers.Contract(
    sliceCoreAddress,
    SliceCoreContract.abi,
    signer
  ) as SliceCore
export const productsModule = (
  signer: ethers.Signer | ethers.providers.Provider
) =>
  new ethers.Contract(
    productsModuleAddress,
    ProductsModuleContract.abi,
    signer
  ) as ProductsModule
export const fundsModule = (
  signer: ethers.Signer | ethers.providers.Provider
) =>
  new ethers.Contract(
    fundsModuleAddress,
    FundsModuleContract.abi,
    signer
  ) as FundsModule

export const slicer = async (
  slicerId: number,
  signer: ethers.Signer | ethers.providers.Provider
) => {
  const slicerAddress = await sliceCore(signer).slicers(slicerId)
  return new ethers.Contract(
    slicerAddress,
    SlicerContract.abi,
    signer
  ) as Slicer
}

export const jbCloner = async (
  signer: ethers.Signer | ethers.providers.Provider
) => {
  return new ethers.Contract(
    deployCloneFactoryAddress,
    jbPayerContract.abi,
    signer
  ) as JBETHERC20ProjectPayerTokensReceiverCloneDeployer
}

export const chainlink = (signer: ethers.Signer | ethers.providers.Provider) =>
  new ethers.Contract(chainlinkFeedAddress, ChainlinkContract.abi, signer)

// export const gasPrice = { gasPrice: 1000000000 }
