import React, { Dispatch, SetStateAction, useEffect, useState } from "react"
import { CardText, DeployCloneSwitch } from "../"
import {
  defaultPurchaseHooks,
  emptyExternalCall,
  HookParams
} from "@components/hooks/purchaseHooks"

type Props = {
  clonePurchaseHook: boolean
  setClonePurchaseHook: Dispatch<SetStateAction<boolean>>
  params: HookParams
  setParams: Dispatch<SetStateAction<HookParams>>
}

const AddProductFormExternal = ({
  clonePurchaseHook,
  setClonePurchaseHook,
  params,
  setParams
}: Props) => {
  const chainId = process.env.NEXT_PUBLIC_CHAIN_ID
  const [selectedHook, setSelectedHook] = useState(undefined)
  const displayedHook =
    selectedHook != undefined && defaultPurchaseHooks[selectedHook]

  const HookComponent = selectedHook != undefined && displayedHook.Component

  useEffect(() => {
    setParams({ externalCall: emptyExternalCall })
    if (
      displayedHook?.deployments?.cloner[chainId] &&
      !displayedHook?.deployments?.factory[chainId]
    ) {
      setClonePurchaseHook(true)
    } else {
      setClonePurchaseHook(false)
    }
  }, [selectedHook])

  return (
    <>
      <h2 className="pb-6">Purchase hook</h2>
      <p className="pb-3">
        Add optional on-chain logic to purchases with pre-configured or custom
        hooks.
      </p>
      <div className="space-y-3">
        {defaultPurchaseHooks.map((hook, i) => {
          const { label, deployments } = hook
          const isActive = selectedHook == i

          return (
            (!deployments ||
              deployments.cloner[chainId] ||
              deployments.factory[chainId]) && (
              <div
                key={i}
                onClick={() =>
                  isActive ? setSelectedHook(undefined) : setSelectedHook(i)
                }
              >
                <CardText label={label} isActive={isActive} />
              </div>
            )
          )
        })}
      </div>
      {selectedHook != undefined && (
        <>
          <p className="pt-6 pb-3 font-semibold">{displayedHook.description}</p>
          <HookComponent params={params} setParams={setParams} />

          <DeployCloneSwitch
            deployments={displayedHook?.deployments}
            clonePurchaseHook={clonePurchaseHook}
            setClonePurchaseHook={setClonePurchaseHook}
          />
          {displayedHook.deployments && (
            <p className="pt-6 font-semibold text-yellow-600">
              Deploying this purchase hook requires an additional on-chain
              transaction
            </p>
          )}
        </>
      )}
      <div>
        <hr className="w-20 mx-auto border-gray-300 my-16" />
      </div>
    </>
  )
}

export default AddProductFormExternal
