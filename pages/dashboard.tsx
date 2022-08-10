import {
  ConnectBlock,
  Container,
  TotalBalance,
  ToWithdrawList
} from "@components/ui"
import { NextSeo } from "next-seo"
import {
  defaultDescription,
  defaultTitle,
  longTitle,
  domain
} from "@components/common/Head"
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
          slicer {
            id
            address
          }
        }
        currencies(where: {toWithdraw_gt: "0"}) {
          id
          withdrawn
        }
      }
    `
  let subgraphData = useQuery(tokensQuery, [account])
  const payee = subgraphData?.payee
  const slicers = payee?.slicers
  const currencies = payee?.currencies
  const currenciesAddresses = currencies?.map((c) => c.id.split("-")[1])

  // Unreleased amounts are taken from blockchain
  // TODO: divide useUnreleased by currencies
  // Are all the currencies in the array the same? Right now there is only ETH
  const unreleased = useUnreleased(slicers, account, currenciesAddresses || [])
  // Amount already withdrawn from the payee
  const withdrawnEth = currencies?.filter((c) => c.id.split("-")[1] == addrO)[0]
    ?.withdrawn
  const toWithdrawEth = unreleased.reduce((acc, curr) => {
    return acc + getEthFromWei(curr, true)
  }, 0)
  const totalEarnedEth =
    Number(ethers.utils.formatEther(withdrawnEth || 0)) + Number(toWithdrawEth)

  // Conversion in USD
  const totalEarnedUsd = (
    Number(totalEarnedEth) * Number(ethUsd?.price)
  ).toFixed(2)
  const toWithdrawUsd = (Number(toWithdrawEth) * Number(ethUsd?.price)).toFixed(
    2
  )

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
          <TotalBalance
            totalEarnedUsd={totalEarnedUsd}
            toWithdrawUsd={toWithdrawUsd}
          />
          <ToWithdrawList
            toWithdrawEth={toWithdrawEth}
            toWithdrawUsd={toWithdrawUsd}
            slicers={slicers}
            account={account}
          />
        </main>
      </ConnectBlock>
    </Container>
  )
}
