import {
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
import { useContractReads } from "wagmi"
import Slicer from "artifacts/contracts/Slicer.sol/Slicer.json"
import { useAddRecentTransaction } from "@rainbow-me/rainbowkit"
import useSWR from "swr"
import fetcher from "@utils/fetcher"

export default function Profile() {
  const { account } = useAppContext()
  const addRecentTransaction = useAddRecentTransaction()

  const slicerIds = []
  const currenciesToFetch = []

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
            currencies {
              id
            }
          }
        }
      }
    `
  let subgraphData = useQuery(tokensQuery, [account])
  const payeeData = subgraphData?.payee
  const slicers = payeeData?.slicers
  // const payeeCurrencyData = payeeData?.currencies

  let orderedSlicers = slicers
    ? [...slicers].sort((a, b) => Number(a.slicer.id) - Number(b.slicer.id))
    : []

  const contracts = orderedSlicers
    ?.map((el) => {
      slicerIds.push(el.slicer.id)

      return el.slicer?.currencies?.map((currency) => {
        const currencyAddress = currency.id.split("-")[0]
        if (!currenciesToFetch.includes(currencyAddress)) {
          currenciesToFetch.push(currencyAddress)
        }

        return {
          addressOrName: el.slicer.address,
          contractInterface: Slicer.abi,
          functionName: "unreleased",
          args: [account, currencyAddress]
        }
      })
    })
    .reduce((prev, curr) => prev.concat(curr), [])

  const {
    data: unreleasedData,
    isError,
    isLoading
  } = useContractReads({
    contracts: contracts || []
  })

  const { data: dbData } = useSWR(
    slicerIds.length
      ? `/api/slicer?ids=${slicerIds.join(
          "_"
        )}&currencies=${currenciesToFetch.join("_")}`
      : null,
    fetcher
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
        <main className="max-w-[420px] mx-auto sm:max-w-screen-md">
          <DoubleText
            inactive
            logoText="My slicers"
            size="text-4xl sm:text-5xl"
            position="pb-20"
          />

          <div className="space-y-4 text-left">
            <SlicersList
              account={account}
              payeeData={payeeData}
              slicers={orderedSlicers}
              loading={!subgraphData}
              unreleasedData={unreleasedData}
              addRecentTransaction={addRecentTransaction}
              dbData={dbData}
            />
          </div>
        </main>
      </ConnectBlock>
    </Container>
  )
}
