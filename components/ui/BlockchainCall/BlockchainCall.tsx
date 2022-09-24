import { mutate } from "swr"
import { LogDescription } from "ethers/lib/utils"
import { Dispatch, SetStateAction, useState, useEffect } from "react"
import Button from "../Button"
import MessageBlock from "../MessageBlock"
import { Message } from "@utils/handleMessage"
import { useAddRecentTransaction } from "@rainbow-me/rainbowkit"
import saEvent from "@utils/saEvent"

type Props = {
  label: string | JSX.Element
  action: () => Promise<any>
  setSuccess: Dispatch<SetStateAction<boolean>>
  setLogs: Dispatch<SetStateAction<LogDescription[]>>
  success?: boolean
  transactionDescription: string
  mutateUrl?: string
  mutateObj?: object
  confetti?: boolean
  saEventName?: string
  isCustomButton?: boolean
}

const BlockchainCall = ({
  label,
  action,
  success,
  setSuccess,
  setLogs,
  mutateUrl,
  mutateObj,
  transactionDescription,
  confetti = false,
  saEventName = "",
  isCustomButton = false
}: Props) => {
  const addRecentTransaction = useAddRecentTransaction()
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState<Message>({
    message: "",
    messageStatus: "success"
  })

  const submit = async () => {
    try {
      if (saEventName) {
        saEvent(saEventName + "_attempt")
      }
      const handleSubmit = (await import("@utils/handleSubmit")).default

      setLoading(true)
      const eventLog = await handleSubmit(
        action(),
        setMessage,
        setLoading,
        setSuccess,
        confetti,
        addRecentTransaction,
        transactionDescription
      )
      setLogs(eventLog)
      if (saEventName) {
        saEvent(saEventName + "_success")
      }
    } catch (err) {
      if (saEventName) {
        saEvent(saEventName + "_fail")
      }
      console.log(err)
    }
  }

  useEffect(() => {
    if (mutateUrl && success) {
      mutate(mutateUrl, mutateObj, false)
      mutate(mutateUrl)
    }
  }, [success])

  return (
    <>
      {isCustomButton ? (
        <Button
          label={label}
          loading={loading}
          onClick={() => submit()}
          className={""}
          color={""}
          double={false}
        />
      ) : (
        <Button
          label={label}
          loading={loading}
          onClick={() => submit()}
          double={!isCustomButton}
        />
      )}
      {isCustomButton ? (
        message.message && (
          <div className="absolute z-10 p-2 bg-gray-800 fade-out">
            <MessageBlock msg={message} />
          </div>
        )
      ) : (
        <div>
          <MessageBlock msg={message} />
        </div>
      )}
    </>
  )
}

export default BlockchainCall
