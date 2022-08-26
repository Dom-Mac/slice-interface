import { Shortcode } from "@utils/useDecodeShortcode"

type Props = {
  shortCodes: Shortcode
  insertShortcode: (shortcode: string) => void
}

const ShortcodesList = ({ shortCodes, insertShortcode }: Props) => {
  return (
    <>
      {Object.entries(shortCodes).map((shortcode, i) => (
        <button
          key={i}
          type="button"
          className="text-xs px-3 py-[3px] cursor-pointer border-[1.5px] rounded-full shadow-sm text-gray-700 border-gray-700 hover:bg-gray-200"
          onClick={() => insertShortcode(shortcode[0])}
        >
          {shortcode[1].label}
        </button>
      ))}
    </>
  )
}

export default ShortcodesList
