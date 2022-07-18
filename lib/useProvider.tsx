import WalletConnect from "@walletconnect/client"
import QRCodeModal from "@walletconnect/qrcode-modal"
import { Dispatch, SetStateAction, useEffect, useState } from "react"
import { ethers } from "ethers"
import { slicer } from "@lib/initProvider"
import { useAppContext } from "@components/ui/context"
import WalletConnectProvider from "@walletconnect/web3-provider"
import { JsonRpcProvider } from "@ethersproject/providers"

export const defaultProvider = new ethers.providers.JsonRpcBatchProvider(
  process.env.NEXT_PUBLIC_NETWORK_URL
)

export const initialize = async (connector) => {
  // Keep this synced with env next_public_network_url
  let provider: JsonRpcProvider
  if (connector.connected) {
    const wcProvider = new WalletConnectProvider({
      rpc: {
        1: "https://eth-mainnet.alchemyapi.io/v2/B59wdqLy61AGhx6UV-ScRCa96t3sdj78",
        4: "https://eth-rinkeby.alchemyapi.io/v2/wbmuZNbuiaab8Bc_ivuDkgJAOVxartLH"
      }
    })
    await wcProvider.enable()
    provider = new ethers.providers.Web3Provider(wcProvider)
  } else if (window.ethereum) {
    provider = new ethers.providers.Web3Provider(window.ethereum)
  } else {
    provider = defaultProvider
  }
  const signer = provider.getSigner()
  return { provider, signer }
}

export const useAllowed = (slicerInfo: any) => {
  const { account, provider, isConnected } = useAppContext()
  const [access, setAccess] = useState({ isAllowed: "", loading: false })
  const { id: slicerId, config, attributes } = slicerInfo

  const getProductAllowed = async () => {
    setAccess({ isAllowed: "", loading: true })
    const slicerContract = await slicer(slicerInfo, provider)

    const isPayeeAllowed: boolean = await slicerContract.isPayeeAllowed(account)
    setAccess({ isAllowed: isPayeeAllowed ? "product" : "", loading: false })
  }

  const getAllowed = async () => {
    setAccess({ isAllowed: "", loading: true })
    if (
      config?.creatorOnly &&
      attributes?.filter((el) => el.trait_type === "Creator")[0].value ===
        account?.toLowerCase()
    ) {
      setAccess({ isAllowed: "metadata", loading: false })
    } else {
      const slicerContract = await slicer(slicerId, provider)
      const isPayeeAllowed: boolean = await slicerContract.isPayeeAllowed(
        account
      )

      if (isPayeeAllowed) {
        setAccess({
          isAllowed: config?.creatorOnly
            ? access.isAllowed == "metadata"
              ? "full"
              : "product"
            : "full",
          loading: false
        })
      }
    }
  }

  useEffect(() => {
    if (slicerInfo) {
      if (slicerId && slicerId != NaN && isConnected && account) {
        getAllowed()
      } else if (typeof slicerInfo == "number") {
        getProductAllowed()
      } else {
        setAccess({ isAllowed: "", loading: false })
      }
    }
  }, [slicerInfo, isConnected, account])
  return access
}

const useProvider = (setLoading: Dispatch<SetStateAction<boolean>>) => {
  const [connector] = useState(
    new WalletConnect({
      bridge: "https://bridge.walletconnect.org", // Required
      qrcodeModal: QRCodeModal
    })
  )

  const [isConnected, setIsConnected] = useState(false)
  const [chainId, setChainId] = useState("")
  const [account, setAccount] = useState("")

  const updateConnection = (accounts: any[], chainId: string) => {
    setIsConnected(accounts.length > 0)
    setAccount(accounts[0])
    setChainId(chainId)
  }

  const getProvider = async () => {
    if (window.ethereum) {
      const provider = new ethers.providers.Web3Provider(window.ethereum)
      const accounts = await provider.listAccounts()

      const chainIdRequest = await window.ethereum.request({
        method: "eth_chainId"
      })
      updateConnection(accounts, chainIdRequest)
    }
  }

  useEffect(() => {
    if (connector.connected) {
      const { accounts, chainId } = connector
      updateConnection(accounts, String(chainId))
    } else {
      getProvider()
    }
    setLoading(false)

    // Subscribe to Metamask events
    if (window.ethereum) {
      window.ethereum.on("accountsChanged", () => {
        getProvider()
      })
      window.ethereum.on("disconnect", () => {
        getProvider()
      })
      window.ethereum.on("chainChanged", (chainId: string) =>
        setChainId(chainId)
      )
    }

    // Subscribe to WalletConnect events
    // Connection events
    connector.on("connect", (error, payload) => {
      if (error) {
        throw error
      }
      // Get provided accounts and chainId
      const { accounts, chainId } = payload.params[0]
      updateConnection(accounts, chainId)
    })

    connector.on("session_update", (error, payload) => {
      if (error) {
        throw error
      }

      // Get updated accounts and chainId
      const { accounts, chainId } = payload.params[0]
      updateConnection(accounts, chainId)
    })

    connector.on("disconnect", (error, payload) => {
      if (error) {
        throw error
      }
      updateConnection([], "")
      // Delete connector
    })
  }, [])

  return { isConnected, chainId, account, connector }
}

export default useProvider
