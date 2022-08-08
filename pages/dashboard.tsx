import { ConnectBlock, Container } from "@components/ui"
import { NextSeo } from "next-seo"
import {
  defaultDescription,
  defaultTitle,
  longTitle,
  domain
} from "@components/common/Head"
import VisibilityOpen from "@components/icons/VisibilityOpen"
import { useAppContext } from "@components/ui/context"
import useQuery from "@utils/subgraphQuery"
import useUnreleased from "@lib/useUnreleased"
import { ethers } from "ethers"
import getEthFromWei from "@utils/getEthFromWei"
import useSWR from "swr"
import fetcher from "@utils/fetcher"

export default function Dashboard() {
  const { account } = useAppContext()
  const addrO = ethers.constants.AddressZero
  const { data: ethUsd } = useSWR(
    "https://api.binance.com/api/v3/ticker/price?symbol=ETHUSDT",
    fetcher
  )

  const tokensQuery = /* GraphQL */ `
      payee(id: "${account?.toLowerCase()}") {
        slicers (where: {slices_gt: "0"}){
          slices
          slicer {
            id
            address
            slices
            minimumSlices
            isImmutable
            productsModuleBalance
            protocolFee
          }
        }
        # currencies(where: {toWithdraw_gt: "0"}){
        # toWithdraw
        # currency {
        #   id
        # }
        # }
      }
      payeeCurrency(id: "${account?.toLowerCase()}-${addrO}") {
        withdrawn
      }
    `
  let subgraphData = useQuery(tokensQuery, [account])
  const slicers = subgraphData?.payee?.slicers

  // TODO: pass array of currencies to useUnreleased taken from subgraph
  // Unreleased amount taken from blockchain
  const unreleased = useUnreleased(slicers, account, [
    ethers.constants.AddressZero
  ])
  // Amount already withdrawn from the payee
  const withdrawn = subgraphData?.payeeCurrency?.withdrawn
  // TODO: convert Eth to USD
  // Are all the currencies in the array the same? Right now there is only ETH
  const toWithdrawEth = unreleased.reduce((acc, curr) => {
    return acc + getEthFromWei(curr, true)
  }, 0)
  const totalEarnedEth =
    Number(ethers.utils.formatEther(withdrawn || 0)) + Number(toWithdrawEth)

  const totalEarnedUsd = Number(totalEarnedEth) * Number(ethUsd?.price)
  const toWithdrawUsd = Number(toWithdrawEth) * Number(ethUsd?.price)

  return (
    <Container page={true}>
      <NextSeo
        title="Your slicers"
        openGraph={{
          title: longTitle,
          description: defaultDescription,
          url: domain,
          images: [
            {
              url: `${domain}/og_image.jpg`,
              width: 1000,
              height: 1000,
              alt: `${defaultTitle} cover image`
            }
          ]
        }}
      />
      <ConnectBlock>
        <main className="max-w-[420px] sm:mx-auto sm:max-w-screen-md justify-self-start">
          <h1 className="mb-6 text-2xl font-normal text-left">
            Earnings Dashboard
          </h1>
          <div className="flex items-center mb-4">
            <p className="mr-3 text-lg ">My balance</p>
            <VisibilityOpen className="h-6" />
          </div>
          <div className="flex justify-between w-3/5 p-2 rounded-lg min-w-max bg-slate-800 dark:bg-slate-800">
            <div className="text-left ">
              <p className="text-xs font-normal text-slate-400">Total earned</p>
              <p className="text-lg font-semibold">$ {totalEarnedUsd}</p>
              <p className="text-xs font-normal text-green-500">
                +200 SLX cashback
              </p>
            </div>
            <div className="text-left ">
              <p className="text-xs font-normal text-slate-400">To withdraw</p>
              <p className="text-lg font-semibold">$ {toWithdrawUsd}</p>
              <p className="text-xs font-normal text-green-500">+200 tokens</p>
            </div>
          </div>
        </main>
      </ConnectBlock>
    </Container>
  )
}
