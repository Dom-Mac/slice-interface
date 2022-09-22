import { ContractInterface, ethers } from "ethers"
import { Dispatch, SetStateAction } from "react"
import { FunctionStruct } from "types/typechain/ProductsModule"
import * as hooks from "./index"

type DeployedAddresses = { [chainId: string]: string }
export type Deployments = {
  cloner: DeployedAddresses
  factory: DeployedAddresses
}

export type HookParams = {
  externalCall: FunctionStruct
  deploy?: {
    deployments?: Deployments
    abi: {
      clonerInterface?: ContractInterface
      factoryInterface?: ContractInterface
    }
    args: any[]
  }
  allowedAddresses?: string[]
}

export type Hook = {
  label: string
  description: string | JSX.Element
  Component: (args: any) => JSX.Element
  deployments?: Deployments
}

export type HookProps = {
  setParams: Dispatch<SetStateAction<HookParams>>
}

export const defaultCheckSelector = "0x95db9368"
export const defaultExecSelector = "0xa23fffb9"
export const defaultExternalCall = {
  data: [],
  value: 0,
  externalAddress: "",
  checkFunctionSignature: defaultCheckSelector,
  execFunctionSignature: defaultExecSelector
}
export const emptyExternalCall = {
  data: [],
  value: 0,
  externalAddress: ethers.constants.AddressZero,
  checkFunctionSignature: "0x00000000",
  execFunctionSignature: "0x00000000"
}

export const defaultPurchaseHooks: Hook[] = [
  hooks.ERC20Gated,
  hooks.ERC721Gated,
  hooks.Allowlisted,
  hooks.SendETH,
  hooks.ExistingHook
]

export const purchaseHooks: Hook[] = Object.values(hooks)
