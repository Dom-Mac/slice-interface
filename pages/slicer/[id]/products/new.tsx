import {
  ActionScreen,
  AddProductForm,
  ConnectBlock,
  Container,
  DoubleText
} from "@components/ui"
import { NextSeo } from "next-seo"
import {
  defaultDescription,
  defaultTitle,
  longTitle,
  domain
} from "@components/common/Head"
import { useAllowed } from "@lib/useProvider"
import { useRouter } from "next/dist/client/router"
import { useEffect, useState } from "react"
import { LogDescription } from "ethers/lib/utils"
import getLog from "@utils/getLog"
import Spinner from "@components/icons/Spinner"
import { useAppContext } from "@components/ui/context"

export default function NewProduct() {
  const { setModalView } = useAppContext()
  const router = useRouter()
  const { id } = router.query
  const { isAllowed, loading } = useAllowed(Number(id))
  const [uploadStep, setUploadStep] = useState(0)
  const [uploadPct, setUploadPct] = useState(0)
  const [cloneAddress, setCloneAddress] = useState("")
  const [success, setSuccess] = useState(false)
  const [logs, setLogs] = useState<LogDescription[]>()
  const eventLog = getLog(logs, "ProductAdded")
  const productId = eventLog && Number(eventLog[1]._hex)

  useEffect(() => {
    if (uploadStep != 0) {
      setModalView({
        cross: false,
        name: `CREATE_PRODUCT_VIEW`,
        params: { uploadStep, uploadPct, setModalView, cloneAddress }
      })
    }
  }, [loading, uploadStep])

  return (
    <Container page={true} size="max-w-screen-xs">
      <NextSeo
        title="Add product"
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
        {loading ? (
          <main className="max-w-[420px] mx-auto sm:max-w-screen-md">
            <DoubleText
              inactive
              logoText="Add product"
              size="text-4xl sm:text-5xl"
              position="pb-12"
            />
            <div className="flex justify-center pb-20">
              <Spinner size="w-10 h-10" />
            </div>
          </main>
        ) : isAllowed == "product" || isAllowed == "full" ? (
          !success ? (
            <main className="max-w-[420px] mx-auto sm:max-w-screen-md">
              <DoubleText
                inactive
                logoText="Add product"
                size="text-4xl sm:text-5xl"
                position="pb-4 sm:pb-8"
              />
              <AddProductForm
                slicerId={Number(id)}
                uploadStep={uploadStep}
                setUploadStep={setUploadStep}
                setUploadPct={setUploadPct}
                setSuccess={setSuccess}
                setLogs={setLogs}
                setCloneAddress={setCloneAddress}
              />
            </main>
          ) : (
            <ActionScreen
              highlightTitle="Product added! 🍰"
              helpText={
                <>
                  <p className="pb-3">
                    You can find the new product with ID <b>#{productId}</b> in
                    the slicer page.
                  </p>
                  <p className="pb-6 text-sm">
                    Wait a few seconds and refresh the page if you don&apos;t
                    see it.
                  </p>
                </>
              }
              buttonLabel="Go to slicer"
              href={`/slicer/${id}`}
              buttonLabelSecondary="Create new product"
              onClickSecondary={() => setSuccess(false)}
              // external
              // targetBlank={false}
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
