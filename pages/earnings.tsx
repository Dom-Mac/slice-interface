import {
  ConnectBlock,
  Container,
  DoubleText,
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
import { useEffect, useState } from "react"
import useCurrenciesData, { Currency } from "@utils/useCurrenciesData"

export default function Dashboard() {
  const { account } = useAppContext()
  const [currencies, setCurrencies] = useState<Currency[]>()

  const tokensQuery = /* GraphQL */ `
      payee(id: "${account?.toLowerCase()}") {
        currencies {
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
  const currenciesData = useCurrenciesData(payeeCurrencies)

  useEffect(() => {
    setCurrencies(currenciesData)
  }, [currenciesData])

  return (
    <Container page={true}>
      <NextSeo
        title="Your earnings"
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
        <main className="sm:mx-auto sm:max-w-screen-md">
          {/* <h1 className="mb-6 text-2xl font-normal text-left md:text-5xl md:text-center md:mb-12">
            Earnings Dashboard
          </h1> */}
          <div className="text-left sm:text-center">
            <DoubleText
              inactive
              logoText="My earnings"
              size="text-3xl sm:text-5xl"
              position="pb-6 sm:pb-20"
            />
          </div>

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
