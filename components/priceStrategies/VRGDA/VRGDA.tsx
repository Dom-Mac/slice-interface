import { CardBasic, ChartVRGDASchedule, Input } from "@components/ui"
import formatNumber from "@utils/formatNumber"
import toWad from "@utils/toWad"
import { useEffect, useState } from "react"
import {
  strategiesList,
  Strategy,
  StrategyParams,
  StrategyProps
} from "../strategies"

type VRGDAStrategyProps = StrategyProps & {
  units: number
}

const label = "VRGDA"

const Component = ({ setPriceParams, units }: VRGDAStrategyProps) => {
  const [rate, setRate] = useState<"Linear" | "Logistic">("Linear")
  const [targetPrice, setTargetPrice] = useState(0)
  const [priceDecayPercent, setPriceDecayPercent] = useState(0)
  const [timeFactor, setTimeFactor] = useState(0)
  const strategy = strategiesList[rate + label]

  useEffect(() => {
    if (units != 0) {
      const { label, abi, deployments } = strategy

      let newPriceParams: StrategyParams = {
        label,
        address: deployments[process.env.NEXT_PUBLIC_CHAIN_ID],
        abi,
        args: [
          toWad(targetPrice),
          toWad(priceDecayPercent / 100),
          toWad(
            rate == "Linear"
              ? timeFactor
              : timeFactor != 0
              ? Math.floor(100000 / timeFactor) / 100000
              : 0
          )
        ]
      }

      setPriceParams(newPriceParams)
    }

    return () => {
      setPriceParams(undefined)
    }
  }, [units, targetPrice, priceDecayPercent, timeFactor, setPriceParams])

  useEffect(() => {
    setTimeFactor(0)
  }, [rate])

  return (
    <>
      <p>
        Use a dynamic price based on a{" "}
        <a
          href="https://www.paradigm.xyz/2022/08/vrgda"
          target="_blank"
          rel="noreferrer"
          className="highlight"
        >
          VRGDA strategy
        </a>
        .
      </p>

      {units == 0 ? (
        <p className="pt-4 text-yellow-600">
          Enable <strong>limited availability</strong> to use a VRGDA strategy.
        </p>
      ) : (
        <>
          <div className="grid grid-cols-2 gap-2 pt-3 pb-6">
            <CardBasic
              label="Linear"
              isActive={rate == "Linear"}
              setisActive={setRate}
            />
            <CardBasic
              label="Logistic"
              isActive={rate == "Logistic"}
              setisActive={setRate}
            />
          </div>
          <div>
            <Input
              type="number"
              label="Target price (ETH)"
              helpText="How much should the product cost if sales are on schedule?"
              placeholder={"0.1"}
              min={0.001}
              step={0.001}
              question={
                <>
                  <p>Target price for the product if sold on pace.</p>
                </>
              }
              value={targetPrice || ""}
              onChange={setTargetPrice}
              required
            />
          </div>
          <div>
            <Input
              type="number"
              label="Daily price decay (%)"
              helpText="How much should the price drop in 1 day if there are no sales?"
              placeholder={"10"}
              min={0.01}
              max={99.99}
              step={0.01}
              question={
                <>
                  <p>The daily percent price decay, with no sales.</p>
                  <p>
                    A high percentage causes significant price variations, while
                    low values reduce deviation from target price based on time
                    and sales.
                  </p>
                </>
              }
              value={priceDecayPercent || ""}
              onChange={setPriceDecayPercent}
              required
            />
          </div>
          <div>
            {rate == "Linear" ? (
              <Input
                type="number"
                label="Daily units to be sold"
                placeholder={"2"}
                min={0.01}
                step={0.01}
                value={timeFactor || ""}
                onChange={setTimeFactor}
                question={
                  <>
                    <p>The number of units to target selling in 1 day</p>
                  </>
                }
                required
              />
            ) : (
              <Input
                type="number"
                label="Time scale (days)"
                helpText={`After how many days ${formatNumber(
                  Math.floor(units * 46) / 100
                )} units (46% of total) should be sold?`}
                placeholder={"420"}
                min={0.1}
                max={100000}
                step={0.1}
                value={timeFactor || ""}
                onChange={setTimeFactor}
                question={
                  <>
                    <p>
                      Time scale controls the steepness of the logistic curve,
                      which affects how quickly the curve&apos;s asymptote is
                      reached.
                    </p>
                  </>
                }
                required
              />
            )}
          </div>
          <ChartVRGDASchedule
            rate={rate}
            units={units}
            timeFactor={timeFactor}
          />
          <p className="pt-12">
            {rate == "Linear" ? (
              <>
                You plan to sell <b>{formatNumber(Number(units))} units</b> in{" "}
                <b>
                  {timeFactor != 0
                    ? formatNumber(Math.floor((100 * units) / timeFactor) / 100)
                    : "..."}{" "}
                  days
                </b>{" "}
                with a target price of{" "}
                <b>{targetPrice != 0 ? targetPrice : "..."} ETH</b>.
              </>
            ) : (
              <>
                You plan to sell{" "}
                <b>
                  {formatNumber(Math.floor(units * 46) / 100)} out of{" "}
                  {formatNumber(Number(units))} units
                </b>{" "}
                in{" "}
                <b>
                  {timeFactor != 0 ? formatNumber(Number(timeFactor)) : "..."}{" "}
                  days
                </b>{" "}
                with a target price of{" "}
                <b>{targetPrice != 0 ? targetPrice : "..."} ETH</b>.
              </>
            )}
          </p>
          <p>
            Sales will earn more than the target price when ahead of the
            schedule, and less if behind.
            {/* MAKE SURE THIS IS CORRECT BEFORE ADDING IT */}
          </p>
          {rate == "Linear" ? (
            <p>
              Price will decrease{" "}
              <b>
                daily by{" "}
                {priceDecayPercent != 0 && timeFactor != 0
                  ? formatNumber(
                      Math.floor((priceDecayPercent * 100) / timeFactor) / 100
                    ) + "% "
                  : "... "}{" "}
                for each unit
              </b>{" "}
              behind schedule, or increase by the same amount if ahead.
            </p>
          ) : (
            <p>
              Price will decrease{" "}
              <b>
                daily by{" "}
                {priceDecayPercent != 0 ? priceDecayPercent + "% " : "..."}
              </b>{" "}
              if there are no sales.
            </p>
          )}
          {/* TODO: How to write this for logistic VRGDA? */}
        </>
      )}
    </>
  )
}

const hook: Strategy = { label, Component }

export default hook
