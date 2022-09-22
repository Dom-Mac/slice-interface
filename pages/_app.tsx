import { ClickToComponent } from "click-to-react-component"
import { Background, Layout } from "@components/ui"
import { AppWrapper } from "@components/ui/context"
import { ThemeProvider } from "next-themes"
import Head from "@components/common/Head"
import { CookiesProvider } from "react-cookie"
import { AppProps } from "next/dist/shared/lib/router/router"
import "../styles/global/styles.scss"

import {
  getDefaultWallets,
  RainbowKitProvider,
  lightTheme,
  midnightTheme
} from "@rainbow-me/rainbowkit"
import { alchemyProvider } from "wagmi/providers/alchemy"
import { publicProvider } from "wagmi/providers/public"
import { chain, createClient, configureChains, WagmiConfig } from "wagmi"
import "@rainbow-me/rainbowkit/styles.css"

const defaultChains =
  process.env.NEXT_PUBLIC_CHAIN_ID === "1"
    ? [chain.mainnet, chain.rinkeby]
    : [chain.rinkeby, chain.mainnet]

const { chains, provider } = configureChains(defaultChains, [
  alchemyProvider({ apiKey: process.env.ALCHEMY_ID }),
  publicProvider()
])

const { connectors } = getDefaultWallets({
  appName: "Slice",
  chains
})

const wagmiClient = createClient({
  autoConnect: true,
  connectors,
  provider
})

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <>
      <ClickToComponent />
      <Head />
      <CookiesProvider>
        <ThemeProvider
          attribute="class"
          storageKey="nightwind-mode"
          defaultTheme="system"
        >
          <WagmiConfig client={wagmiClient}>
            <RainbowKitProvider
              chains={chains}
              theme={
                // isDark
                //   ? midnightTheme({
                //       accentColor: "#2563eb",
                //       accentColorForeground: "white",
                //       borderRadius: "medium"
                //     })
                //   :
                lightTheme({
                  accentColor: "#2563eb",
                  accentColorForeground: "white",
                  borderRadius: "medium"
                })
              }
              showRecentTransactions={true}
              coolMode
            >
              <AppWrapper>
                <Layout>
                  <Background />
                  <Component {...pageProps} />
                </Layout>
              </AppWrapper>
            </RainbowKitProvider>
          </WagmiConfig>
        </ThemeProvider>
      </CookiesProvider>
    </>
  )
}

export default MyApp

// TODO: Add dark mode to rainbowKit
// TODO: Wait for rainbow to add chainId to <ConnectButton />
