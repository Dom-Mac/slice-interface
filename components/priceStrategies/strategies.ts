import { ContractInterface } from "ethers"
import { Dispatch, SetStateAction } from "react"
import * as strategies from "./index"
import linearVrgdaInterface from "./VRGDA/LinearVRGDAPrices.json"
import logisticVrgdaInterface from "./VRGDA/LogisticVRGDAPrices.json"

export type Strategy = {
  label: string
  Component: (args: any) => JSX.Element
}

export type StrategyProps = {
  setPriceParams: Dispatch<SetStateAction<StrategyParams>>
}

export type StrategyParams = {
  label: string
  address: string
  abi?: ContractInterface
  args?: any[]
}

export const strategiesRender: Strategy[] = [
  { label: "Standard", Component: () => null },
  strategies.VRGDA,
  strategies.Custom
]

export const strategiesList = {
  LinearVRGDA: {
    label: "Linear VRGDA",
    abi: linearVrgdaInterface.abi,
    deployments: {
      1: "0x524b3DcfcfaFc8c635C054Db64105472B0D4eF9c",
      4: "0x0a0866FaEe7896591e5E252C2A0FdC6949E191bE" // Staging
      // 4: "0x6ad7f1b1FF0bb170f189EDA74671Af2a4585931d" // Testnet
    }
  },
  LogisticVRGDA: {
    label: "Logistic VRGDA",
    abi: logisticVrgdaInterface.abi,
    deployments: {
      1: "0xF8ec0D24d89d139228508E6C3E0262d70Fc5B592",
      4: "0x1FaEE38F761b794445A855F07eCcF644f360762D" // Staging
      // 4: "0xf76eA6EF16AA523c3E5FbF38224294ef7a132E5c" // Testnet
    }
  }
}
