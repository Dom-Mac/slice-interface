import resolveEns from "@utils/resolveEns"
import React, {
  Dispatch,
  InputHTMLAttributes,
  SetStateAction,
  useEffect,
  useState
} from "react"
import { useAppContext } from "../context"
import Input from "../Input/Input"

export interface Props extends InputHTMLAttributes<HTMLInputElement> {
  address: string
  label?: string
  onChange?: (...args: any[]) => any
  resolvedAddress: string
  setResolvedAddress: Dispatch<SetStateAction<string>>
}

const InputAddress: React.FC<Props> = (props) => {
  const { provider } = useAppContext()
  const {
    address,
    required,
    label,
    onChange,
    resolvedAddress,
    setResolvedAddress,
    ...rest
  } = props

  const addressReduced = resolvedAddress
    ? resolvedAddress.substring(resolvedAddress.length - 4) !== ".eth" &&
      resolvedAddress !== "Invalid ENS name"
      ? resolvedAddress.replace(
          resolvedAddress.substring(5, resolvedAddress.length - 3),
          `___`
        )
      : resolvedAddress
    : null

  useEffect(() => {
    if (provider && address) {
      const timeout = setTimeout(
        () => resolveEns(provider, address, setResolvedAddress),
        200
      )
      return () => {
        clearTimeout(timeout)
        setResolvedAddress("")
      }
    }
  }, [provider, address])

  return (
    <div className={`relative`}>
      <Input
        type="string"
        value={address}
        placeholder="0x… / slice-so.eth"
        label={label}
        required={required}
        error={resolvedAddress === "Invalid ENS name"}
        onChange={onChange}
      />
      {resolvedAddress && (
        <p
          className={`${
            resolvedAddress === "Invalid ENS name"
              ? "text-red-500"
              : "text-blue-600 dark:text-sky-300"
          } absolute text-xs opacity-80 font-black left-0 bottom-[-23px]
          }`}
        >
          {addressReduced}
        </p>
      )}
    </div>
  )
}

export default InputAddress
