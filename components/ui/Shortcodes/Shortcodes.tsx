import Delete from "@components/icons/Delete"
import {
  defaultShortcodes,
  ReducedShortcode,
  Shortcode
} from "@utils/useDecodeShortcode"
import { Dispatch, SetStateAction, useState } from "react"
import { InputList, ShortcodesList } from ".."

type Props = {
  customShortcodes: ReducedShortcode
  setCustomShortcodes: Dispatch<SetStateAction<ReducedShortcode>>
  instructions: string
  setInstructions: Dispatch<SetStateAction<string>>
}

const Shortcodes = ({
  customShortcodes,
  setCustomShortcodes,
  instructions,
  setInstructions
}: Props) => {
  const [customShortcodesArr, setCustomShortcodesArr] = useState<Shortcode[]>(
    []
  )
  const insertShortcode = (shortcode: string) => {
    setInstructions(instructions + `{{${shortcode}}}`)
    // TODO: Add shortcode at cursor position
  }

  const addShortcode = () => {
    const shortcodeId = customShortcodesArr.length + 1
    const newShortcodes = [...customShortcodesArr]
    newShortcodes.push({
      [`customCode${shortcodeId}`]: {
        label: `Custom code ${shortcodeId}`,
        value: ""
      }
    })

    setCustomShortcodesArr(newShortcodes)
  }

  const removeShortcode = () => {
    setCustomShortcodesArr(
      customShortcodesArr.slice(0, customShortcodesArr.length - 1)
    )
  }

  const setShortcodes = (
    label: string,
    customCode: string,
    shortcodes: string[]
  ) => {
    const newShortcodes = customShortcodes

    newShortcodes[`${customCode}`] = shortcodes

    setCustomShortcodes(newShortcodes)
  }

  return (
    <div className="text-left">
      <p className="text-xs font-semibold text-gray-700">Shortcodes</p>
      <div className="flex flex-wrap gap-2 pt-2">
        <ShortcodesList
          shortCodes={defaultShortcodes}
          insertShortcode={insertShortcode}
        />

        {customShortcodesArr.map((shortcode, i) => {
          const [code] = Object.entries(shortcode)

          return (
            <button
              key={i}
              type="button"
              className="text-xs px-3 py-[3px] cursor-pointer border-[1.5px] rounded-full shadow-sm text-gray-700 border-gray-700 hover:bg-gray-200"
              onClick={() => insertShortcode(code[0])}
            >
              {code[1].label}
            </button>
          )
        })}

        <button
          type="button"
          className="text-xs px-3 py-[3px] cursor-pointer border-[1.5px] rounded-full shadow-sm text-green-700 border-green-700 hover:bg-green-100"
          onClick={() => addShortcode()}
        >
          + New
        </button>
      </div>

      {customShortcodesArr.length != 0 && (
        <p className="pt-8">
          Assign a different custom value to each buyer when they redeem from
          Slice.
        </p>
      )}

      {customShortcodesArr.map((shortcode, i) => {
        const [code] = Object.entries(shortcode)

        return (
          <InputList
            key={i}
            customCode={code[0]}
            label={code[1].label}
            setValues={setShortcodes}
            question={
              <>
                <p>
                  Each buyer will be shown a different custom code until they
                  run out.
                </p>
                <p>
                  Make sure the number of available codes is higher than product
                  availability.
                </p>
              </>
            }
          />
        )
      })}

      {customShortcodesArr.length != 0 && (
        <div
          className="inline-flex items-center space-x-2 text-sm text-red-600 cursor-pointer group"
          onClick={() => removeShortcode()}
        >
          <Delete className="group-hover:text-red-500" />
          <p className="group-hover:text-red-500">Remove last shortcode</p>
        </div>
      )}
    </div>
  )
}

export default Shortcodes

// TODO: Add custom styling around shortcode
// TODO: Simplify shortcode mess
