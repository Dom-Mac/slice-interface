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
import useSWR from "swr"
import fetcher from "@utils/fetcher"

export default function Dashboard() {
  const { account } = useAppContext()
  const { data: ethUsd } = useSWR(
    "https://api.binance.com/api/v3/ticker/price?symbol=ETHUSDT",
    fetcher
  )

  const tokensQuery = /* GraphQL */ `
      payee(id: "${account?.toLowerCase()}") {
        currencies(where: {toWithdraw_gt: "0"}) {
          id
          withdrawn
          toWithdraw
          toPayToProtocol
          paidToProtocol
        }
      }
    `
  let subgraphData = useQuery(tokensQuery, [account])
  const payee = subgraphData?.payee
  const currencies = payee?.currencies

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
          <TotalBalance currencies={currencies} ethUsd={ethUsd} />
          {/*<ToWithdrawList
            toWithdrawEth={toWithdrawEth}
            toWithdrawUsd={toWithdrawUsd}
            slicers={slicers}
            account={account}
          /> */}
        </main>
      </ConnectBlock>
    </Container>
  )
}
