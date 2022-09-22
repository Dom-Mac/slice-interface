import {
  ConnectBlock,
  Container,
  DoubleText,
  PurchasesList
} from "@components/ui"
import { NextSeo } from "next-seo"
import {
  defaultDescription,
  defaultTitle,
  longTitle,
  domain
} from "@components/common/Head"

export default function Purchases() {
  return (
    <Container page={true}>
      <NextSeo
        title="Your purchases"
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
            logoText="Your purchases"
            size="text-4xl sm:text-5xl"
            position="pb-16 sm:pb-20"
          />
          <div className="space-y-4 text-left">
            <PurchasesList />
          </div>
        </main>
      </ConnectBlock>
    </Container>
  )
}
