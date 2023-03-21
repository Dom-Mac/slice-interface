import { Dispatch, SetStateAction, useState } from "react"
import { Question, SliceFormAddCurrencies } from "@components/ui"
import MySwitch from "../MySwitch"
import Chevron from "@components/icons/Chevron"

type Props = {
  isImmutable: boolean
  isCreatorMetadata: boolean
  currencies: string[]
  setIsImmutable: Dispatch<SetStateAction<boolean>>
  setIsCreatorMetadata: Dispatch<SetStateAction<boolean>>
  setCurrencies: Dispatch<SetStateAction<string[]>>
}

const SliceFormAdvancedSettings = ({
  isImmutable,
  isCreatorMetadata,
  setIsImmutable,
  setIsCreatorMetadata,
  currencies,
  setCurrencies
}: Props) => {
  const [showAnswer, setShowAnswer] = useState(false)
  return (
    <>
      <div
        className="relative flex items-center w-full col-span-8 gap-0 pt-5 mx-auto cursor-pointer max-w-screen-xs group xs:col-span-10 sm:mx-6"
        onClick={() => setShowAnswer((showAnswer) => !showAnswer)}
      >
        <div className="flex-shrink-0 w-6 h-6 mb-2 mr-2">
          <Chevron
            className={`transition-transform duration-200 ease-out ${
              showAnswer
                ? "-rotate-90"
                : "group-hover:translate-x-[6px] -rotate-180"
            } `}
          />
        </div>
        <span className="mt-0 mb-2 font-semibold leading-relaxed text-black">
          Advanced settings
        </span>
      </div>
      {showAnswer && (
        <div className="grid grid-cols-6 col-span-8 gap-4 py-2 sm:mx-6 xs:col-span-10 xs:grid-cols-8 xs:pl-8 xs:pr-4 max-w-screen-xs">
          <div className="relative flex items-center justify-end col-span-5 pb-3 xs:col-end-7">
            <p className="pr-1">Supported currencies</p>
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
          {/* <div className="relative flex items-center justify-end col-span-5 xs:col-span-7">
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
                      Superowners should not be able to edit the metadata at
                      their discretion (useful for community-owned slicers)
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
          <div className="flex items-center">
            <MySwitch enabled={isImmutable} setEnabled={setIsImmutable} />
          </div>
          <div className="relative flex items-center justify-end col-span-5 xs:col-span-7">
            <p className="pr-1">Creator metadata</p>
            <Question
              text={
                <>
                  <p>
                    Makes the metadata editable{" "}
                    <b>only by the slicer creator</b> and not by superowners.
                  </p>
                  <p>Consider enabling it if:</p>
                  <ul>
                    <li>
                      You&apos;re creating the slicer for someone else but need
                      to have control over its metadata.
                    </li>
                    <li>
                      Superowners should not be able to edit the metadata at
                      their discretion (useful for community-owned slicers)
                    </li>
                  </ul>
                </>
              }
            />
          </div>
          <div className="flex items-center">
            <MySwitch
              enabled={isCreatorMetadata}
              setEnabled={setIsCreatorMetadata}
            />
          </div> */}
        </div>
      )}
    </>
  )
}

export default SliceFormAdvancedSettings
