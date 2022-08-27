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
import useTokensMetadata, { Currency } from "@utils/useTokensMetadata"
import useCurrenciesQuotes from "@utils/useCurrenciesQuotes"
import { useEffect, useState } from "react"

export default function Dashboard() {
  const { account } = useAppContext()
  const [currencies, setCurrencies] = useState<Currency[]>([])

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
  const payeeCurrencies = subgraphData?.payee?.currencies as Currency[]
  const tokensMetadata = useTokensMetadata(payeeCurrencies)
  const tokensQuotes = useCurrenciesQuotes(tokensMetadata)

  useEffect(() => {
    let formattedArray: Currency[] = []
    if (Object.keys(tokensQuotes).length && tokensMetadata.length) {
      payeeCurrencies?.forEach((currency, index) => {
        const metadata = tokensMetadata[index]
        formattedArray.push({
          ...currency,
          metadata: metadata,
          quote: tokensQuotes[metadata?.symbol]
        })
      })
    }
    setCurrencies(formattedArray)
  }, [payeeCurrencies, tokensQuotes])

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
        <main className="sm:mx-auto sm:max-w-screen-md justify-self-start">
          <h1 className="mb-6 text-2xl font-normal text-left md:text-5xl md:text-center md:mb-12">
            Earnings Dashboard
          </h1>

          <TotalBalance currencies={currencies} />
          <ToWithdrawList
            currencies={currencies}
            account={account}
            setCurrencies={setCurrencies}
          />
        </main>
      </ConnectBlock>
    </Container>
  )
}
