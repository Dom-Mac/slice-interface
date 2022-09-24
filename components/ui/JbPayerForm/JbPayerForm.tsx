import Button from "../Button"
import JbPayerFormBlock from "../JbPayerFormBlock"
import constants from "constants.json"
import { ConnectButton, useAddRecentTransaction } from "@rainbow-me/rainbowkit"
import { useState } from "react"
import cloneProjectPayer, {
  DeployParams
} from "@lib/handlers/chain/cloneProjectPayer/cloneProjectPayer"
import { useSigner } from "wagmi"
import handleSubmit from "@utils/handleSubmit"
import { Message } from "@utils/handleMessage"
import MessageBlock from "../MessageBlock"
import ActionScreen from "../ActionScreen"

const JbPayerForm = () => {
  const { data: signer } = useSigner()
  const addRecentTransaction = useAddRecentTransaction()
  const directory =
    constants[process.env.NEXT_PUBLIC_CHAIN_ID][
      process.env.NEXT_PUBLIC_ENVIRONMENT
    ].addresses.JBDirectory

  const [params, setParams] = useState<DeployParams>({
    projectId: 0,
    beneficiary: "",
    preferClaimedTokens: true,
    memo: "Sent from Slice 🍰",
    metadata: [],
    preferAddToBalance: true,
    directory,
    owner: ""
  })
  const [loadingButton, setLoadingButton] = useState(false)
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)
  const [contractAddress, setContractAddress] = useState("")
  const [message, setMessage] = useState<Message>({
    message: "",
    messageStatus: "success"
  })

  const submit = async (e: React.SyntheticEvent<EventTarget>) => {
    e.preventDefault()
    setLoadingButton(true)

    try {
      const eventLogs = await handleSubmit(
        cloneProjectPayer(signer, params),
        setMessage,
        setLoading,
        setSuccess,
        true,
        addRecentTransaction,
        "Create JB Payer"
      )
      if (eventLogs) {
        setContractAddress(eventLogs[0].args[0])
      }
    } catch (err) {
      console.log(err)
    }
    setLoadingButton(false)
  }

  return (
    <>
      {!success ? (
        !loading ? (
          <>
            <p className="text-center">
              Deploy a{" "}
              <a
                href="https://info.juicebox.money/dev/build/utilities/project-payer"
                target="_blank"
                rel="noreferrer"
                className="highlight"
              >
                JB payer contract
              </a>{" "}
              to send slicer earnings directly to a Juicebox V2 treasury.
            </p>
            <form className="pt-8" onSubmit={submit}>
              <JbPayerFormBlock params={params} setParams={setParams} />

              <div className="pt-10 text-center">
                <ConnectButton.Custom>
                  {({ account, chain, openConnectModal, mounted }) =>
                    !mounted || !account || !chain ? (
                      <Button
                        label="Connect to deploy"
                        onClick={openConnectModal}
                        type="button"
                      />
                    ) : (
                      <Button
                        label="Deploy"
                        type="submit"
                        loading={loadingButton}
                      />
                    )
                  }
                </ConnectButton.Custom>
              </div>
              <p className="pt-6 font-semibold text-center text-yellow-600">
                Only compatible with V2 treasuries
              </p>
              <MessageBlock msg={message} />
            </form>
          </>
        ) : (
          <ActionScreen
            helpText={
              <div className="max-w-sm pb-4 mx-auto font-semibold text-yellow-600">
                <p>Please wait while the blockchain does its thing</p>
              </div>
            }
            loading
          />
        )
      ) : (
        <ActionScreen
          text="JB payer contract created! 🍰"
          helpText={
            <div className="max-w-lg pb-6 mx-auto space-y-4">
              <p>
                The project payer address is{" "}
                <a
                  href={`https://${
                    process.env.NEXT_PUBLIC_CHAIN_ID === "4" ? "rinkeby." : ""
                  }etherscan.io/address/${contractAddress}`}
                  target="_blank"
                  rel="noreferrer"
                  className="highlight"
                >
                  {contractAddress}
                </a>
              </p>
              <p className="font-semibold text-yellow-600">
                Take note of this address as it will not be saved.
              </p>
            </div>
          }
          buttonLabel="Create a new contract"
          onClick={() => setSuccess(false)}
        />
      )}
    </>
  )
}

export default JbPayerForm
