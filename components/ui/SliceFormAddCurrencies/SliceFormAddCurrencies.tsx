import { useEffect, useState, Dispatch, SetStateAction } from "react"
import Add from "@components/icons/Add"
import Delete from "@components/icons/Delete"
import ethImg from "public/eth.svg"
import Image from "next/image"
import InputAddress from "../InputAddress"
import Input from "../Input"

type Props = {
  currencies: string[]
  setCurrencies: Dispatch<SetStateAction<string[]>>
}

const SliceFormAddCurrencies = ({ currencies, setCurrencies }: Props) => {
  const [visible, setVisible] = useState(false)
  const [address, setAddress] = useState("")
  const [isValidAddress, setIsValidAddress] = useState(false)

  const validateAddress = (value: string) => {
    const ethAddressRegex = /^0x[a-fA-F0-9]{40}$/

    if (ethAddressRegex.test(value)) {
      setIsValidAddress(true)
    } else {
      setIsValidAddress(false)
    }
  }

  const addCurrency = () => {
    if (!currencies.includes(address)) {
      setCurrencies([...currencies, address])
    }
    setAddress("")
  }

  const removeCurrency = (index: number) => {
    const newCurrencies = currencies.filter((_, i) => i !== index)
    setCurrencies(newCurrencies)
  }

  useEffect(() => {
    validateAddress(address)
  }, [address])

  return (
    <>
      <div className="relative z-30 flex items-center justify-end col-span-3 pb-3 xs:col-span-3 xs:col-start-7 md:col-span-3 md:col-start-8">
        {currencies.length > 1 && (
          <p className="pr-1">ETH +{currencies.length - 1}</p>
        )}
        <Image src={ethImg} alt="Token logo" width={28} height={28} />
        <div onClick={() => setVisible(!visible)} className="ml-2">
          {!visible && <Add />}
          {visible && <Delete />}
        </div>
      </div>
      {visible && (
        <div className="z-30 col-span-8 pb-3 xs:col-span-8 xs:col-start-2 md:col-span-3 md:col-start-8">
          <div>
            {/* slice(1) because first currency is eth, currencies = [""] */}
            {currencies.slice(1).map((currency, index) => (
              <div key={index} className="flex items-center gap-2 pb-2">
                <div
                  className="text-red-100"
                  onClick={() => removeCurrency(index)}
                >
                  <Delete />
                </div>
                <p>{currency}</p>
              </div>
            ))}
          </div>
          <div>
            <Input
              type="string"
              value={address}
              placeholder={"0x..."}
              error={false}
              onChange={setAddress}
            />
            {isValidAddress && (
              <div
                className="inline-flex gap-4 text-green-600 opacity-75 cursor-pointer hover:opacity-100"
                onClick={() => addCurrency()}
              >
                <p className="inline-block font-semibold">Add</p>
              </div>
            )}
          </div>
        </div>
      )}
    </>
  )
}

export default SliceFormAddCurrencies
