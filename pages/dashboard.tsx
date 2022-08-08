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
import Image from "next/image"
import ethImg from "public/eth.svg"
import withdrawImg from "public/download.svg"

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
  const currenciesIds = currencies?.map((c) => c.id.split("-")[1])

  // Unreleased amounts are taken from blockchain
  // TODO: divide useUnreleased by currencies
  // Are all the currencies in the array the same? Right now there is only ETH
  const unreleased = useUnreleased(slicers, account, currenciesIds || [])
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
          <div className="flex items-center mb-4">
            <p className="mr-3 text-lg ">My balance</p>
            <VisibilityOpen className="h-6" />
          </div>
          <div className="flex justify-between w-3/5 p-2 rounded-lg min-w-max bg-slate-800 dark:bg-slate-800">
            <div className="text-left ">
              <p className="text-xs font-normal text-slate-400">Total earned</p>
              <p className="text-lg font-semibold">$ {totalEarnedUsd}</p>
              {/* <p className="text-xs font-normal text-green-500">
                +200 SLX cashback
              </p> */}
            </div>
            <div className="text-left ">
              <p className="text-xs font-normal text-slate-400">To withdraw</p>
              <p className="text-lg font-semibold">$ {toWithdrawUsd}</p>
              {/* <p className="text-xs font-normal text-green-500">+200 tokens</p> */}
            </div>
          </div>
          <p className="p-2 mb-5 text-xs font-normal text-left text-slate-500 ">
            Current SLX cashback fee: 2.5%
          </p>
          <div className="w-screen px-4 -mb-10 -ml-4 pt-7 bg-slate-800 dark:bg-slate-800 rounded-t-2xl container-list">
            <div className="flex justify-between mb-8">
              <p className="text-xs font-normal text-slate-400">Select all</p>
              <p className="text-sm font-normal border-b border-yellow-400">
                Widthraw all
              </p>
            </div>
            <div className="flex justify-between p-2 border rounded-lg border-sky-400">
              <div className="flex items-center">
                <input
                  type="checkbox"
                  className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
                />
                <div className="h-6 mx-2">
                  <Image src={ethImg} alt="ETH" width={24} height={24} />
                </div>
                <div className="pt-1 text-left">
                  <p className="text-lg font-normal leading-none">ETH</p>
                  <p className="text-xs font-normal text-slate-400">Ethereum</p>
                </div>
              </div>
              <div className="flex items-center">
                <div className="pt-1 text-right">
                  <p className="text-lg font-normal">{toWithdrawEth}</p>
                  <p className="text-xs font-normal text-slate-400">
                    $ {toWithdrawUsd}
                  </p>
                </div>
                <div className="h-6 pl-4">
                  <Image
                    src={withdrawImg}
                    alt="download"
                    width={24}
                    height={24}
                  />
                </div>
              </div>
            </div>
          </div>
        </main>
      </ConnectBlock>
    </Container>
  )
}
