import { useAppContext } from "@components/ui/context"
import { ConnectButton } from "@rainbow-me/rainbowkit"
import saEvent from "@utils/saEvent"
import DoubleText from "../DoubleText"

const ConnectBlock = ({ children }) => {
  const { isConnected } = useAppContext()
  return isConnected ? (
    children
  ) : (
    <>
      <div className="flex flex-col items-center py-6 mx-auto max-w-screen-xs">
        <DoubleText
          inactive
          logoText="Connect your wallet"
          size="text-4xl sm:text-5xl"
        />
        <p className="py-10 text-lg">
          You need to connect your wallet to view this page.
        </p>
        <div onClick={() => saEvent("connect_wallet_attempt")}>
          <ConnectButton />
        </div>
      </div>
    </>
  )
}

export default ConnectBlock
