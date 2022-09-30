import { NewTransaction } from "@rainbow-me/rainbowkit/dist/transactions/transactionStore"
import { Dispatch, SetStateAction } from "react"
import { Message } from "./handleMessage"

const handleSubmit = async (
  action: Promise<any>,
  setMessage: Dispatch<SetStateAction<Message>> | null,
  setLoading: Dispatch<SetStateAction<boolean>> | null,
  setSuccess: Dispatch<SetStateAction<boolean>> | null,
  confetti = false,
  addRecentTransaction: (transaction: NewTransaction) => void,
  transactionDescription: string
) => {
  const handleMessage = (await import("./handleMessage")).default
  const launchConfetti = (await import("./launchConfetti")).default
  const handleLog = (await import("./handleLog")).default

  if (setMessage) {
    setMessage({ message: "", messageStatus: "success" })
  }
  try {
    const [contract, call] = await action
    setLoading && setLoading(true)

    addRecentTransaction({
      hash: call.hash,
      description: transactionDescription
    })

    const eventLogs = await handleLog(contract, call)
    setLoading && setLoading(false)

    setSuccess && setSuccess(true)

    if (confetti) {
      launchConfetti()
    }
    return eventLogs
  } catch (err) {
    setLoading && setLoading(false)
    const message = err.data?.message
      ?.split("reverted with reason string '")[1]
      ?.slice(0, -1)
    if (setMessage) {
      handleMessage({ message, messageStatus: "error" }, setMessage)
    }
  }
}

export default handleSubmit
