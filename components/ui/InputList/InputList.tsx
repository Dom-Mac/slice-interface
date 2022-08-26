import { useEffect, useState } from "react"
import Textarea from "../Textarea"

type Props = {
  label: string
  customCode: string
  question?: JSX.Element
  setValues?: (label: string, customCode: string, values: string[]) => void
}

const InputList = ({ label, customCode, question, setValues }: Props) => {
  const [valuesText, setValuesText] = useState("")

  const values = valuesText.split(",").filter((address) => address.trim() != "")

  useEffect(() => {
    if (setValues) {
      const cleanedValues = values.map((val) => val.trim())
      setValues(label, customCode, cleanedValues)
    }
  }, [valuesText])

  return (
    <div className="relative my-6">
      <Textarea
        label={label}
        placeholder="Add values separated by comma"
        question={question}
        value={valuesText}
        onChange={setValuesText}
        markdownView={false}
      />
      <p className="absolute text-sm text-gray-700 right-0 bottom-[-26px]">
        Total:{" "}
        <span className="font-black text-blue-600 dark:text-sky-300">
          {values.length}
        </span>
      </p>
    </div>
  )
}

export default InputList
