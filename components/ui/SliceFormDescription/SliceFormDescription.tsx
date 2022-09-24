import DoubleText from "../DoubleText"
import FAQsItem from "../FAQsItem"

const SliceFormDescription = () => {
  return (
    <>
      <div className="py-6 mx-auto space-y-4 sm:px-6 max-w-screen-xs md:text-left">
        <div className="pb-4 prose">
          <p>
            <b>Slicers are collaborative on-chain stores.</b>
          </p>
          <p>
            Owners can use them to sell any product in any currency, fully
            on-chain, and to split payments between multiple addresses.
          </p>
          <p>
            <DoubleText inactive logoText="Slices 🍰" size="text-normal" />{" "}
            represent ownership over a slicer and its earnings.{" "}
            <b>
              The more slices you hold, the more you earn from payments to your
              slicer.
            </b>
          </p>
        </div>
        <ul className="prose">
          {/* <FAQsItem
            id="store"
            question="How to set up a decentralized store"
            answer={
              <>
                <p>
                  The slicer itself will be the decentralized store, so first of
                  all you need to create one.
                </p>
                <p>
                  Then on your slicer page you&apos;ll find a button that says{" "}
                  <b>Add product</b>. That&apos;s where you can , and once the process is completed it will
                  appear among the slicer products.
                </p>
                <p>
                  To learn more, check out{" "}
                  <a href="/#sold" target="_blank" rel="noreferrer">
                    what can be sold from slicers
                  </a>{" "}
                  in the full FAQ list.
                </p>
                <p className="font-bold">
                  <span className="text-yellow-600">Note:</span> Only
                  superowners can put products on sale, so if you plan to sell
                  make sure to have enough slices to be one (see superowner
                  slices).
                </p>
              </>
            }
          /> */}
          <FAQsItem
            id="dynamic"
            question="What is dynamic payment splitting"
            answer={
              <>
                <p>
                  One of the distinctive characteristics of the Slice protocol
                  is that <b>slices are freely tradable</b>.
                </p>
                <p>
                  Dynamic payments splitting means that{" "}
                  <b>
                    the slicer splits any payment received based on its current
                    owners
                  </b>
                  .
                </p>
                <p>
                  Let&apos;s say you own 20 out of 100 slices of a certain
                  slicer, granting you 20% over its earnings. If you
                  transferred/sold 5 slices, from that moment on you&apos;d get
                  15% of any payment to the slicer. At the same time the new
                  owner would receive the remaining 5%.
                </p>
              </>
            }
          />
          <FAQsItem
            id="single"
            question="Creating a slicer with one owner"
            answer={
              <>
                <p>
                  Slicers are collaborative tools but you can also create a
                  slicer just for yourself, or someone else. You may consider
                  doing so:
                </p>
                <ul>
                  <li>
                    To sell products from a d-store without sharing ownership
                    with others.
                  </li>
                  <li>
                    If you don&apos;t know the other owners in advance, you
                    could mint the slices to yourself and transfer them later.
                  </li>
                </ul>
              </>
            }
          />
          <FAQsItem
            id="total"
            question="How to pick number of slices"
            answer={
              <>
                <p>
                  The total number of slices defines the{" "}
                  <b>minimum divisible unit of ownership</b>. If a slicer has
                  100 slices, each slice entitles to 1% ownership. If it&apos;s
                  1M slices, each slice gives 0,0001%.
                </p>
                <p>
                  There is no right or wrong amount, the only effect is to
                  increase/decrease partial ownership that slicer owners may
                  trade in the open market (nft marketplaces).
                </p>
                <p>
                  If the displayed percentage is green, the owner is also a
                  superowner (see below to learn more).
                </p>
              </>
            }
            wrapperClassName="xs:hidden"
          />
        </ul>
        <div className="text-right">
          <a
            className="text-sm opacity-80 highlight hover:opacity-100"
            href="/#faq"
            target="_blank"
            rel="noreferrer"
          >
            See full FAQs
          </a>
        </div>
      </div>
    </>
  )
}

export default SliceFormDescription
