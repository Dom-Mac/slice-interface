import React, { Dispatch, SetStateAction, useEffect, useState } from "react"
import { Question, Input } from "@components/ui"
import Add from "@components/icons/Add"
import Delete from "@components/icons/Delete"

type Props = {}

const SliceFormAddCurrencies = ({}: Props) => {
  const [currencies, setCurrencies] = useState([""])
  const [inputCount, setInputCount] = useState(1)

  const handleChange = (value: string, index: number) => {
    let items = currencies
    items[index] = value
    console.log(items)
    setCurrencies(items)
  }

  const handleDelete = (index: number) => {
    let items = currencies
    items.splice(index, 1)
    setInputCount(inputCount - 1)
    setCurrencies(items)
  }

  useEffect(() => console.log(currencies), [currencies])

  return (
    <>
      <p className="col-span-10 pt-2 font-semibold text-center text-yellow-600">
        Add slicer supported ERC20
      </p>

      <div className="relative flex items-center col-span-10 text-gray-700 xs:col-start-2">
        <div className="mb-[-25px] text-gray-700 relative items-center hidden xs:flex">
          <p className="pr-1 text-sm font-semibold">Contract address</p>
          <Question
            text={
              <>
                <p>
                  Slices 🍰 represent ownership over a slicer and its earnings.
                </p>
                <p>
                  The total number of slices defines the{" "}
                  <b>minimum divisible unit of ownership</b>.{" "}
                </p>
                <p>
                  There is no right or wrong amount, the only effect is to
                  increase/reduce partial ownership that owners may trade in the
                  open market (nft marketplaces).
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
      </div>
      {[...Array(inputCount)].map((el, index) => {
        return (
          <React.Fragment key={index}>
            <div className="col-span-1 col-start-1 mx-auto mt-3 mb-3">
              <div className="">
                {index != 0 && <Delete onClick={() => handleDelete(index)} />}
              </div>
            </div>
            <div className="col-span-8 col-start-2 pt-3">
              <input
                className={
                  "peer py-2 pl-5 w-full appearance-none rounded-t-sm shadow-light-focusable ease-in-out pr-3 border-t-0 border-r-0 border-l-0 border-b-[3px] focus:outline-none bg-white text-black border-blue-300 focus:border-sky-600 placeholder-gray-400 disabled:text-gray-500 disabled:border-blue-100 disabled:bg-gray-50"
                }
                onChange={(e) => handleChange(e.target.value, index)}
                placeholder="0x..."
                autoComplete="off"
                autoCorrect="off"
                autoCapitalize="off"
                spellCheck="false"
                onWheel={(e) => e.currentTarget.blur()}
              ></input>
            </div>
          </React.Fragment>
        )
      })}
      <div className="col-span-1 col-start-1 mx-auto ">
        <Add onClick={() => setInputCount(inputCount + 1)} />
      </div>

      <div className="col-span-7 py-3 pr-2 text-left text-green-500 xs:col-span-6 md:col-span-6">
        <p
          className="inline-block font-semibold opacity-75 cursor-pointer hover:opacity-100"
          onClick={() => setInputCount(inputCount + 1)}
        >
          Add currency
        </p>
      </div>
    </>
  )
}

export default SliceFormAddCurrencies
