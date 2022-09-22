import {
  AccountBalance,
  ConnectBlock,
  Container,
  DoubleText,
  SlicersList
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

export default function Profile() {
  const { account } = useAppContext()

  const tokensQuery = /* GraphQL */ `
      payee(id: "${account?.toLowerCase()}") {
        slicers (
          where: {slices_gt: "0"}
        ) {
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
        # currencies(where: {toWithdraw_gt: "1"}){
        #   toWithdraw
        #   currency {
        #     id
        #   }
        # }
      }
    `
  let subgraphData = useQuery(tokensQuery, [account])
  const payeeData = subgraphData?.payee
  const slicers = payeeData?.slicers
  // const payeeCurrencyData = payeeData?.currencies

  let orderedSlicers = slicers
    ? [...slicers].sort((a, b) => Number(a.slicer.id) - Number(b.slicer.id))
    : []

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
        <main className="max-w-[420px] mx-auto sm:max-w-screen-md">
          <DoubleText
            inactive
            logoText="My slicers"
            size="text-4xl sm:text-5xl"
            position="pb-20"
          />
          {/* <AccountBalance
            account={account}
            payeeCurrencyData={payeeCurrencyData}
          /> */}

          <div className="space-y-4 text-left">
            <SlicersList
              account={account}
              payeeData={payeeData}
              slicers={orderedSlicers}
              loading={!subgraphData}
            />
          </div>
        </main>
      </ConnectBlock>
    </Container>
  )
}
