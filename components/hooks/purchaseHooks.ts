import { ContractInterface, ethers } from "ethers"
import { Dispatch, SetStateAction } from "react"
import { FunctionStruct } from "types/typechain/ProductsModule"
import * as hooks from "./index"

export type Params = {
  externalCall: FunctionStruct
  deploy?: {
    factoryAddresses?: { [chainId: number]: string }
    abi: ContractInterface
    args: any[]
  }
  allowedAddresses?: string[]
}

export type Hook = {
  label: string
  description: string
  Component: (args: any) => JSX.Element
  factoryAddresses?: { [chainId: number]: string }
}

export type HookProps = {
  setParams: Dispatch<SetStateAction<Params>>
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
