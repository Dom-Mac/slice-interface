import useDecodeShortcode, { ReducedShortcode } from "@utils/useDecodeShortcode"
import React, { Dispatch, SetStateAction } from "react"
import { FilesList, Shortcodes, Textarea } from ".."

type Props = {
  slicerId: number
  thankMessage: string
  setThankMessage: Dispatch<SetStateAction<string>>
  instructions: string
  setInstructions: Dispatch<SetStateAction<string>>
  notes: string
  setNotes: Dispatch<SetStateAction<string>>
  files: File[]
  setFiles: Dispatch<SetStateAction<File[]>>
  customShortcodes: ReducedShortcode
  setCustomShortcodes: Dispatch<SetStateAction<ReducedShortcode>>
}

const AddProductFormPurchases = ({
  slicerId,
  thankMessage,
  setThankMessage,
  instructions,
  setInstructions,
  notes,
  setNotes,
  files,
  setFiles,
  customShortcodes,
  setCustomShortcodes
}: Props) => {
  const decodedInstructions = useDecodeShortcode(
    "buyerAddress",
    "0",
    String(slicerId),
    "0",
    instructions
  )

  return (
    <>
      <h2 className="pb-6">Purchase info</h2>
      <p className="pb-3">
        Customize what buyers see after buying the product.
      </p>
      <div>
        <Textarea
          label="Message to buyers"
          placeholder="Thank you for buying our product! ❤️"
          value={thankMessage}
          onChange={setThankMessage}
          rows={4}
        />
      </div>
      <div>
        <Textarea
          label="Instructions"
          placeholder="How can buyers redeem or use the product?"
          value={instructions}
          previewValue={decodedInstructions}
          onChange={setInstructions}
          rows={4}
        />
      </div>
      <Shortcodes
        customShortcodes={customShortcodes}
        setCustomShortcodes={setCustomShortcodes}
        instructions={instructions}
        setInstructions={setInstructions}
      />

      <div>
        <hr className="w-20 mx-auto border-gray-300 my-16" />
      </div>
      <h2 className="pb-6">Encrypted notes & files</h2>
      <p className="pb-3">
        Add files or notes that can only be decrypted by buyers (increases
        transaction cost).
      </p>
      <div>
        <Textarea
          label="Encrypted Notes"
          placeholder="Additional notes"
          value={notes}
          onChange={setNotes}
          rows={4}
        />
      </div>
      <div className="py-6">
        <FilesList title="Upload files" files={files} setFiles={setFiles} />
      </div>
    </>
  )
}

export default AddProductFormPurchases

// Other kinds of purchase data
// - A link of some sort? Webhook? What else?
// - Additional text info
