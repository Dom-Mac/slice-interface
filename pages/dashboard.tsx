import { ConnectBlock, Container } from "@components/ui"
import { NextSeo } from "next-seo"
import {
  defaultDescription,
  defaultTitle,
  longTitle,
  domain
} from "@components/common/Head"
import VisibilityOpen from "@components/icons/VisibilityOpen"

export default function Profile() {
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
          <h1 className="mb-6 text-2xl font-normal text-left">
            Earnings Dashboard
          </h1>
          <div className="flex items-center mb-4">
            <p className="mr-3 text-lg ">My balance</p>
            <VisibilityOpen className="h-6" />
          </div>
          <div className="flex w-3/4 p-2 rounded-lg bg-slate-800 dark:bg-slate-800">
            <div className="w-1/2 text-left">
              <p className="text-xs font-normal text-slate-400">Total earned</p>
              <p className="text-lg font-semibold">$ 999.99</p>
              <p className="text-xs font-normal text-green-500">
                +200 SLX cashback
              </p>
            </div>
            <div className="w-1/2 text-left">
              <p className="text-xs font-normal text-slate-400">To withdraw</p>
              <p className="text-lg font-semibold">$ 2345.67</p>
              <p className="text-xs font-normal text-green-500">+200 tokens</p>
            </div>
          </div>
        </main>
      </ConnectBlock>
    </Container>
  )
}
