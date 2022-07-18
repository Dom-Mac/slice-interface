import { useEffect, useState, Dispatch, SetStateAction } from "react"
import { Input, SliceFormInputBlock, Question } from "@components/ui"
import Add from "@components/icons/Add"
import { useAppContext } from "@components/ui/context"
import MySwitch from "../MySwitch"

type Props = {
  success: boolean
  addresses: string[]
  shares: number[]
  minimumShares: number
  totalShares: number
  isImmutable: boolean
  isCreatorMetadata: boolean
  setAddresses: Dispatch<SetStateAction<string[]>>
  setShares: Dispatch<SetStateAction<number[]>>
  setMinimumShares: Dispatch<SetStateAction<number>>
  setTotalShares: Dispatch<SetStateAction<number>>
  setIsImmutable: Dispatch<SetStateAction<boolean>>
  setIsCreatorMetadata: Dispatch<SetStateAction<boolean>>
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
  setIsCreatorMetadata
}: Props) => {
  const { account } = useAppContext()
  const [initAddress, setInitAddress] = useState("")
  const [inputCount, setInputCount] = useState(2)
  const [removedCount, setRemovedCount] = useState(0)

  useEffect(() => {
    setInitAddress(account)
  }, [account])

  useEffect(() => {
    if (success) {
      resetInputs()
    }
  }, [success])

  const resetInputs = () => {
    setInputCount(2)
    setRemovedCount(0)
    setAddresses([initAddress])
    setShares([1000000])
    setMinimumShares(0)
    setTotalShares(1000000)
  }

  return (
    <div>
      <div className="grid items-center grid-cols-8 text-left xs:grid-cols-10 md:grid-cols-12 gap-x-4 gap-y-4 xs:gap-y-6">
        <p className="mb-[-25px] text-sm text-gray-700 font-semibold hidden xs:block xs:col-span-5 xs:col-start-2 md:col-span-7 md:col-start-2">
          Addresses
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
            position="top-[35px] right-[-35px]"
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

        <div className="col-span-1 col-start-1 mx-auto ">
          <Add onClick={() => setInputCount(inputCount + 1)} />
        </div>

        <div className="col-span-7 py-3 pr-2 text-left text-green-500 xs:col-span-6 md:col-span-6">
          <p
            className="inline-block font-semibold opacity-75 cursor-pointer hover:opacity-100"
            onClick={() => setInputCount(inputCount + 1)}
          >
            Add slicer owner
          </p>
        </div>

        <div className="relative flex items-center justify-end col-span-5 pb-3 xs:col-end-7">
          <p className="pr-1">Superowner slices</p>
          <Question
            text={
              <>
                <p>
                  Accounts with more than the chosen amount of slices will be{" "}
                  <a
                    className="font-black highlight"
                    href="/#superowner"
                    target="_blank"
                    rel="noreferrer"
                  >
                    superowners with privileged access
                  </a>{" "}
                  to the slicer.
                </p>
                <p className="font-bold">
                  Only superowners can edit slicer metadata and sell products
                  from the decentralized store.
                </p>
              </>
            }
          />
        </div>

        <div className="col-span-3 xs:col-span-3 xs:col-start-7 md:col-span-3 md:col-start-8">
          <Input
            type="number"
            placeholder="100000"
            error={minimumShares > totalShares || minimumShares < 0}
            required
            onChange={setMinimumShares}
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
        <div className="relative flex items-center justify-end col-span-5 xs:col-end-7">
          <p className="pr-1">Immutable metadata</p>
          <Question
            text={
              <>
                <p>
                  Makes the metadata (name, description, image, etc.) be
                  editable <b>only once</b> after creating the slicer.
                </p>
                <p>Consider enabling it if:</p>
                <ul>
                  <li>
                    The slicer represents a <b>collectible asset</b> whose
                    metadata should not change once created
                  </li>
                  <li>
                    Superowners should not be able to edit the metadata at their
                    discretion (useful for community-owned slicers)
                  </li>
                </ul>
                <p>
                  <b>Note:</b> Slicers metadata are currently stored on Slice
                  servers, not on IPFS.
                </p>
              </>
            }
          />
        </div>
        <div className="flex">
          <MySwitch enabled={isImmutable} setEnabled={setIsImmutable} />
        </div>
        <div className="relative flex items-center justify-end col-span-5 xs:col-end-7">
          <p className="pr-1">Creator metadata</p>
          <Question
            text={
              <>
                <p>
                  Makes the metadata editable <b>only by the slicer creator</b>{" "}
                  and not by superowners.
                </p>
                <p>Consider enabling it if:</p>
                <ul>
                  <li>
                    You&apos;re creating the slicer for someone else but need to
                    have control over its metadata.
                  </li>
                  <li>
                    Superowners should not be able to edit the metadata at their
                    discretion (useful for community-owned slicers)
                  </li>
                </ul>
              </>
            }
          />
        </div>
        <div className="flex">
          <MySwitch
            enabled={isCreatorMetadata}
            setEnabled={setIsCreatorMetadata}
          />
        </div>
      </div>
    </div>
  )
}

export default SliceFormBlockSplitter
