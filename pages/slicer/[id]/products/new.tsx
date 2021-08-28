import {
  ActionScreen,
  AddProductForm,
  ConnectBlock,
  Container,
  DoubleText,
} from "@components/ui"
import { NextSeo } from "next-seo"
import {
  defaultDescription,
  defaultTitle,
  longTitle,
  domain,
} from "@components/common/Head"
import { useAllowed } from "@lib/useProvider"
import { useRouter } from "next/dist/client/router"
import { useState } from "react"
import { LogDescription } from "ethers/lib/utils"
import getLog from "@utils/getLog"

export default function NewProduct() {
  const router = useRouter()
  const { id } = router.query
  const { isAllowed, loading } = useAllowed(Number(id))
  const [loadingForm, setLoadingForm] = useState(false)
  const [success, setSuccess] = useState(false)
  const [logs, setLogs] = useState<LogDescription[]>()
  const eventLog = getLog(logs, "ProductAdded")

  return (
    <Container page={true}>
      <NextSeo
        title="Add a new product"
        openGraph={{
          title: longTitle,
          description: defaultDescription,
          url: `https://${domain}`,
          images: [
            {
              url: `https://${domain}/og_image.jpg`,
              width: 1000,
              height: 1000,
              alt: `${defaultTitle} cover image`,
            },
          ],
        }}
      />
      <ConnectBlock>
        {loading ? (
          <p className="text-lg">Loading...</p>
        ) : isAllowed ? (
          !success ? (
            !loadingForm ? (
              <main className="max-w-[420px] mx-auto sm:max-w-screen-md">
                <DoubleText
                  inactive
                  logoText="Add a new product"
                  size="text-4xl sm:text-5xl"
                  position="pb-12"
                />
                <AddProductForm
                  success={success}
                  setLoading={setLoadingForm}
                  setSuccess={setSuccess}
                  setLogs={setLogs}
                />
              </main>
            ) : (
              <ActionScreen
                text="Adding product ..."
                helpText="Please wait while the blockchain does its thing"
                loading
              />
            )
          ) : (
            <ActionScreen
              highlightTitle="Product added! 🍰"
              helpText={
                <p className="pb-6">
                  You can find the new product with id{" "}
                  <b>{eventLog && eventLog[0]}</b> in the slicer page.
                </p>
              }
              buttonLabel="Go to slicer"
              href={`/slicer/${id}`}
              buttonLabelSecondary="Add a new product"
              onClickSecondary={() => setSuccess(false)}
            />
          )
        ) : (
          <ActionScreen
            text="You are not allowed to access this page"
            href="/"
            buttonLabel="Return to home"
          />
        )}
      </ConnectBlock>
    </Container>
  )
}

// Todo: Test actionScreen logs
