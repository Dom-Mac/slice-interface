import { useEffect, useState, Dispatch, SetStateAction } from "react"
import {
  Input,
  SliceFormAdvancedSettings,
  SliceFormInputBlock,
  SliceFormAddCurrencies,
  Question
} from "@components/ui"
import Add from "@components/icons/Add"
import { useAppContext } from "@components/ui/context"

type Props = {
  success: boolean
  addresses: string[]
  shares: number[]
  minimumShares: number
  totalShares: number
  isImmutable: boolean
  isCreatorMetadata: boolean
  currencies: string[]
  setAddresses: Dispatch<SetStateAction<string[]>>
  setShares: Dispatch<SetStateAction<number[]>>
  setMinimumShares: Dispatch<SetStateAction<number>>
  setTotalShares: Dispatch<SetStateAction<number>>
  setIsImmutable: Dispatch<SetStateAction<boolean>>
  setIsCreatorMetadata: Dispatch<SetStateAction<boolean>>
  setCurrencies: Dispatch<SetStateAction<string[]>>
}

const SliceFormBlockSplitter = ({
  success,
  addresses,
  shares,
  minimumShares,
  totalShares,
  isImmutable,
  isCreatorMetadata,
  setAddresses,
  setShares,
  setMinimumShares,
  setTotalShares,
  setIsImmutable,
  setIsCreatorMetadata,
  currencies,
  setCurrencies
}: Props) => {
  const { account } = useAppContext()
  const [minimumSharesAuto, setMinimumSharesAuto] = useState(true)
  const [initAddress, setInitAddress] = useState("")
  const [inputCount, setInputCount] = useState(1)
  const [removedCount, setRemovedCount] = useState(0)

  const handleSetMinimumShares = (value: number) => {
    setMinimumShares(value)
    setMinimumSharesAuto(false)
  }

  useEffect(() => {
    if (minimumSharesAuto) {
      const maxShares = Math.max(...shares)
      setMinimumShares(
        maxShares > totalShares / 2
          ? Math.floor(totalShares / 2 + 1)
          : maxShares
      )
    }
  }, [totalShares, setMinimumShares])

  useEffect(() => {
    setInitAddress(account)
  }, [account])

  useEffect(() => {
    if (success) {
      resetInputs()
    }
  }, [success])

  const resetInputs = () => {
    setInputCount(1)
    setRemovedCount(0)
    setAddresses([initAddress])
    setShares([1000000])
    setMinimumShares(1000000)
    setTotalShares(1000000)
  }

  return (
    <div className="grid items-center grid-cols-8 text-left xs:grid-cols-10 md:grid-cols-12 gap-x-4 gap-y-4 xs:gap-y-6">
      <p className="mb-[-25px] text-sm text-gray-700 font-semibold hidden xs:block xs:col-span-5 xs:col-start-2 md:col-span-7 md:col-start-2">
        Owner addresses
      </p>
      <div className="mb-[-25px] text-gray-700 relative items-center hidden xs:flex">
        <p className="pr-1 text-sm font-semibold">Slices</p>
        <Question
          text={
            <>
              <p>
                Slices 🍰 represent ownership over a slicer and its earnings.
              </p>
              <p>
                The total number of slices defines the{" "}
                <b>minimum divisible unit of ownership</b>.{" "}
                {totalShares ? (
                  <>
                    With the current setup,{" "}
                    <b>
                      1 Slice ={" "}
                      {Math.floor((1 / totalShares) * 1000000000) / 10000000}%
                    </b>{" "}
                    of ownership.
                  </>
                ) : (
                  <>
                    If a slicer has 100 slices, <b>1 Slice = 1%</b> of
                    ownership.
                  </>
                )}
              </p>
              <p>
                If the displayed percentage is green, the owner is also a
                superowner (see below to learn more).
              </p>
            </>
          }
          position="bottom-0 right-[-35px]"
        />
      </div>
      {[...Array(inputCount)].map((el, key) => {
        const i = key
        return (
          <SliceFormInputBlock
            key={key}
            index={i}
            signerAddress={initAddress}
            addresses={addresses}
            shares={shares}
            totalShares={totalShares}
            minimumShares={minimumShares}
            removedCount={removedCount}
            setAddresses={setAddresses}
            setShares={setShares}
            setTotalShares={setTotalShares}
            setRemovedCount={setRemovedCount}
          />
        )
      })}

      <div className="col-span-7 col-start-1 sm:ml-3">
        <div
          className="inline-flex gap-4 text-green-600 opacity-75 cursor-pointer hover:opacity-100"
          onClick={() => setInputCount(inputCount + 1)}
        >
          <Add />

          <p className="inline-block font-semibold">Add owner</p>
        </div>
      </div>

      <div className="relative flex items-center justify-end col-span-5 pb-3 xs:col-end-7">
        <p className="pr-1">Superowner slices</p>
        <Question
          text={
            <>
              <p>
                Accounts with more than the chosen amount of slices can{" "}
                <b>edit slicer metadata and add products on sale.</b>
              </p>
            </>
          }
          position="bottom-[15px] left-0"
        />
      </div>

      <div className="col-span-3 xs:col-span-3 xs:col-start-7 md:col-span-3 md:col-start-8">
        <Input
          type="number"
          placeholder="100000"
          value={minimumShares}
          onChange={handleSetMinimumShares}
          error={minimumShares > totalShares || minimumShares < 0}
          required
          min={1}
        />
      </div>
      <div className="flex items-center col-start-6 pl-5 mb-3 xs:pl-0 xs:col-span-1">
        <p
          className={`text-sm font-bold ${
            minimumShares > totalShares ? "text-red-500" : ""
          }`}
        >
          {minimumShares != 0 &&
            totalShares != 0 &&
            Math.floor((minimumShares / totalShares) * 10000) / 100 + "%"}
        </p>
      </div>

      <div className="relative flex items-center justify-end col-span-5 pb-3 xs:col-end-7">
        <p className="pr-1">Currencies</p>
        <Question
          text={
            <>
              <p>
                <b>ETH is supported by default. </b>
                Currencies can be added at this step or after creating the
                slicer
              </p>
            </>
          }
          position="bottom-[15px] left-0"
        />
      </div>
      <SliceFormAddCurrencies
        currencies={currencies}
        setCurrencies={setCurrencies}
      />
      {/* 
      <SliceFormAdvancedSettings
        isImmutable={isImmutable}
        isCreatorMetadata={isCreatorMetadata}
        setIsImmutable={setIsImmutable}
        setIsCreatorMetadata={setIsCreatorMetadata}
      /> */}
    </div>
  )
}

export default SliceFormBlockSplitter
