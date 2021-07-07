import Link from "next/link"
import { Button, ConnectBlock, DoubleText, SliceForm } from "@components/ui"
import { useAppContext } from "@components/ui/context"

export default function Home() {
  const { isConnected } = useAppContext()

  return (
    <main className="py-12 text-center md:py-16">
      <DoubleText
        inactive
        logoText={`Create a Slicer`}
        size="text-4xl sm:text-6xl"
        position="pb-8"
      />
      <h2 className="pb-8">Just slice it</h2>
      {isConnected ? (
        <>
          <div className="space-y-4 max-w-screen-xs">
            <p>
              Create a special, fractionable NFT called a{" "}
              <DoubleText inactive logoText="Slicer" size="text-normal" /> which
              can be shared among multiple accounts.
            </p>
            <p>
              When slicers receive ETH, their owners can redeem an amount
              proportional to the owned shares.
            </p>
            <p>
              <Link href="/">
                <a className="highlight">Learn why slicers are cool here ✨</a>
              </Link>
            </p>
          </div>
          <SliceForm />
        </>
      ) : (
        <ConnectBlock />
      )}
    </main>
  )
}
