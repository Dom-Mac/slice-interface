import { Input } from "@components/ui"
import fetcher from "@utils/fetcher"
import { Dispatch, SetStateAction, useEffect, useState } from "react"
import useSWR from "swr"

type Props = {
  ethValue: number
  usdValue: number
  setEthValue: Dispatch<SetStateAction<number>>
  setUsdValue: Dispatch<SetStateAction<number>>
  loading?: boolean
  error?: boolean
  required?: boolean
  disabled?: boolean
  label?: string
  actionLabel?: string
  marginLabel?: string
  question?: JSX.Element
  action?: () => any
}

const InputPrice = ({
  ethValue,
  usdValue,
  setEthValue,
  setUsdValue,
  loading,
  error,
  required,
  disabled,
  label,
  actionLabel,
  marginLabel,
  question,
  action
}: Props) => {
  const { data } = useSWR(
    "https://api.binance.com/api/v3/ticker/price?symbol=ETHUSDT",
    fetcher
  )
  const [isEth, setIsEth] = useState(true)

  const currency = isEth ? "Ξ" : "$"
  const destinationCurrency = isEth ? "$" : "Ξ"

  const handleChange = (value) => {
    if (isEth) {
      setEthValue(value)
      setUsdValue(value * Number(data?.price))
    } else {
      setUsdValue(value)
      setEthValue(value / Number(data?.price))
    }
  }

  useEffect(() => {
    if (isEth) {
      setEthValue(Math.floor(ethValue * 10000) / 10000)
    } else {
      setUsdValue(Math.floor(usdValue * 100) / 100)
    }
  }, [isEth])

  return (
    <div className="w-full mx-auto space-y-6">
      <div className="relative">
        {action ? (
          <Input
            type="number"
            placeholder={isEth ? "0.01" : "100"}
            min={0}
            step={isEth ? 0.001 : 0.01}
            label={label}
            prefix={currency}
            prefixAction={() => setIsEth((isEth) => !isEth)}
            value={isEth ? ethValue || "" : usdValue || ""}
            onChange={handleChange}
            onClick={() => action()}
            onClickLabel={actionLabel}
            loading={loading}
            error={error}
            required={required}
            disabled={disabled}
            question={question}
          />
        ) : (
          <Input
            type="number"
            placeholder={isEth ? "0.01" : "100"}
            min={0}
            step={isEth ? 0.001 : 0.01}
            label={label}
            prefix={currency}
            prefixAction={() => setIsEth((isEth) => !isEth)}
            value={isEth ? ethValue || "" : usdValue || ""}
            onChange={handleChange}
            disabled={disabled}
            error={error}
            required={required}
            question={question}
          />
        )}
        {ethValue != 0 && (
          <div
            className={`absolute top-0 right-0 flex items-center h-full pb-0.5 ${
              marginLabel || "mr-8"
            }
          ${label ? (question ? "pt-11" : "pt-7") : ""}`}
          >
            <p className="text-sm text-gray-600">
              {destinationCurrency}{" "}
              {isEth
                ? usdValue
                  ? Math.floor(usdValue * 100) / 100
                  : 0
                : ethValue
                ? Math.floor(ethValue * 10000) / 10000
                : 0}
            </p>
          </div>
        )}
      </div>
    </div>
  )
}

export default InputPrice
