import { useEffect, useState, Dispatch, SetStateAction } from "react"
import Add from "@components/icons/Add"
import Delete from "@components/icons/Delete"
import ethImg from "public/eth.svg"
import Image from "next/image"
import InputAddress from "../InputAddress"

type Props = {
  currencies: string[]
  setCurrencies: Dispatch<SetStateAction<string[]>>
}

const SliceFormAddCurrencies = ({ currencies, setCurrencies }: Props) => {
  const [visible, setVisible] = useState(false)
  const [address, setAddress] = useState("")
  const [resolvedAddress, setResolvedAddress] = useState("")

  const addCurrency = () => {
    if (address) {
      setCurrencies([...currencies, address])
      setAddress("")
      setResolvedAddress("")
    }
  }

  const removeCurrency = (index: number) => {
    const newCurrencies = currencies.filter((_, i) => i !== index)
    setCurrencies(newCurrencies)
  }

  return (
    <>
      <div className="relative z-30 flex items-center justify-end col-span-3 pb-3 xs:col-span-3 xs:col-start-7 md:col-span-3 md:col-start-8">
        {currencies.length > 1 && <p>Eth +{currencies.length - 1}</p>}
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
              <div key={index} className="flex items-center gap-2">
                <p>{currency}</p>
                <div
                  className="text-red-100"
                  onClick={() => removeCurrency(index)}
                >
                  <Delete />
                </div>
              </div>
            ))}
          </div>
          <div>
            <InputAddress
              address={address}
              onChange={setAddress}
              required={false}
              resolvedAddress={resolvedAddress}
              setResolvedAddress={setResolvedAddress}
            />
          </div>
          <div className="flex items-center justify-end">
            <div
              className="inline-flex gap-4 text-green-600 opacity-75 cursor-pointer hover:opacity-100"
              onClick={() => addCurrency()}
            >
              <Add />
              <p className="inline-block font-semibold">Add currency</p>
            </div>
          </div>
        </div>
      )}
    </>
  )
}

export default SliceFormAddCurrencies
