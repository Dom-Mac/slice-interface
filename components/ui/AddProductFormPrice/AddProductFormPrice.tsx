import { useState, Dispatch, SetStateAction, useEffect } from "react"
import { InputPrice, InputSwitch, CardBasic } from "@components/ui"
import {
  strategiesRender,
  Strategy
} from "@components/priceStrategies/strategies"

type Props = {
  isFree: boolean
  ethValue: number
  usdValue: number
  isUSD: boolean
  units: number
  setEthValue: Dispatch<SetStateAction<number>>
  setUsdValue: Dispatch<SetStateAction<number>>
  setIsUSD: Dispatch<SetStateAction<boolean>>
  setPriceParams: Dispatch<SetStateAction<any>>
}

const AddProductFormPrice = ({
  isFree,
  ethValue,
  usdValue,
  isUSD,
  units,
  setEthValue,
  setUsdValue,
  setIsUSD,
  setPriceParams
}: Props) => {
  const [priceStrategy, setPriceStrategy] = useState<Strategy>(
    strategiesRender[0]
  )

  const StrategyComponent =
    priceStrategy != undefined && priceStrategy.Component

  const handleSetStrategy = (label: string) => {
    setPriceStrategy(
      strategiesRender.find((strategy) => strategy.label == label)
    )
  }

  useEffect(() => {
    if (priceStrategy.label != "Standard") {
      setEthValue(0)
      setUsdValue(0)
    }
  }, [priceStrategy])

  return (
    <>
      <h2 className="pb-6">Pricing strategy</h2>
      <div className="grid grid-cols-3 gap-2 pt-3 pb-6 sm:grid-cols-3">
        {strategiesRender.map((strategy, i) => (
          <CardBasic
            key={i}
            label={strategy.label}
            isActive={strategy.label == priceStrategy.label}
            setisActive={handleSetStrategy}
          />
        ))}
      </div>
      {priceStrategy.label == "Standard" ? (
        <>
          <InputPrice
            ethValue={ethValue}
            setEthValue={setEthValue}
            usdValue={usdValue}
            setUsdValue={setUsdValue}
            label="Price per unit"
          />
          <InputSwitch
            label="Dynamic pricing"
            questionText={
              <>
                <p>
                  If enabled, the buyer will pay in ETH the corresponding USD
                  value set
                  {usdValue && usdValue != 0 && (
                    <b> ${Number(usdValue).toFixed(2)}</b>
                  )}
                  . It&apos;s like setting the product price in USD and thus{" "}
                  <b>protects against changes in ETH value over time.</b>
                </p>
                <p>
                  <b>Note:</b> Products with dynamic pricing have a slightly
                  higher gas fee for the buyer.
                </p>
              </>
            }
            enabled={isUSD}
            setEnabled={setIsUSD}
          />
          {isFree ? (
            <p className="text-yellow-600">
              <b>
                If a price is not set this product can be purchased for free
              </b>
            </p>
          ) : null}
        </>
      ) : (
        <StrategyComponent setPriceParams={setPriceParams} units={units} />
      )}
      <div>
        <hr className="w-20 mx-auto my-16 border-gray-300" />
      </div>
    </>
  )
}

export default AddProductFormPrice
