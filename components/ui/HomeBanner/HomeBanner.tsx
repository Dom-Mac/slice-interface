import Link from "next/link"
import { Banner, Button } from "@components/ui"
import { accounts } from "../Social/Social"

const HomeBanner = () => {
  return (
    <Banner title="Contribute to the DAO" id="contribute" inverted>
      <div className="mx-auto space-y-6 max-w-screen-xs">
        <p>
          If you&apos;re excited about what we&apos;re building, consider
          supporting Slice by contributing to our treasury on Juicebox.
        </p>
        <p>
          In exchange for your contribution you&apos;ll become a DAO member and
          receive <b>SLX governance tokens</b>.
        </p>
        <div className="pt-1 pb-4">
          <Button
            label="Go to treasury"
            href="https://juicebox.money/p/slice"
            external
          />
        </div>
        <p className="text-sm text-gray-300">
          Check out{" "}
          <Link href="/blog/treasury">
            <a className="text-white highlight highlight-inverted">this post</a>
          </Link>{" "}
          for more info, and if you have questions just reach out on{" "}
          <a
            className="text-white highlight highlight-inverted"
            href={accounts.discord}
            target="_blank"
            rel="noreferrer"
          >
            Discord
          </a>
        </p>
      </div>
    </Banner>
  )
}

export default HomeBanner
