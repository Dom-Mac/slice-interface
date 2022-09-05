import React, { Dispatch, SetStateAction } from "react"
import { InputSwitch } from ".."
import { Deployments } from "@components/hooks/purchaseHooks"
import useSWR from "swr"
import fetcher from "@utils/fetcher"

type Props = {
  deployments: Deployments
  clonePurchaseHook: boolean
  setClonePurchaseHook: Dispatch<SetStateAction<boolean>>
}

const DeployCloneSwitch = ({
  deployments,
  clonePurchaseHook,
  setClonePurchaseHook
}: Props) => {
  const { data } = useSWR(
    "https://api.binance.com/api/v3/ticker/price?symbol=ETHUSDT",
    fetcher
  )
  const chainId = process.env.NEXT_PUBLIC_CHAIN_ID

  return (
    deployments?.factory[chainId] &&
    deployments?.cloner[chainId] && (
      <div className="pt-4">
        <InputSwitch
          label="Deploy as clone"
          questionText={
            <>
              <p>
                Deploying the hook as an immutable clone allows you to reduce
                the cost of deployment, but slightly increases the purchase cost
                for buyers.
              </p>
              <p>
                The cost increase for each buyer is ~5k gas, so 0.0001 ETH (${" "}
                {Math.floor(0.01 * Number(data?.price)) / 100}) with a gas price
                of 20 gwei.
              </p>
            </>
          }
          enabled={clonePurchaseHook}
          setEnabled={setClonePurchaseHook}
        />
      </div>
    )
  )
}

export default DeployCloneSwitch
