import Arrow from "@components/icons/Arrow"
import { DoubleText } from "@components/ui"
import Link from "next/link"

export const section1 = (
  <>
    <h1>
      <DoubleText inactive logoText="Meet the Slicer" size="text-normal" />
    </h1>
    <p>
      A smart contract that{" "}
      <b>distributes any payment it receives to its owners</b>, proportionally
      to their owned{" "}
      <DoubleText logoText="slices 🍰" size="text-normal" inactive />
    </p>
    <p>
      Each slicer also provides a{" "}
      <b>decentralized storefront from where owners can sell anything</b>,
      enabling trustless commerce at the blockchain layer.
    </p>
  </>
)

export const section2 = (
  <>
    <h1>
      <DoubleText
        inactive
        logoText="Split payments, dynamically"
        size="text-normal"
      />
    </h1>
    <p>
      Slices are ERC1155{" "}
      <DoubleText inactive logoText="Semi-Fungible Tokens" size="text-normal" />{" "}
      which represent ownership over a slicer and its earnings. Much like{" "}
      <DoubleText inactive logoText="tradable royalties" size="text-normal" />.
    </p>
    <p>
      <b>Owners can transfer or sell slices</b>, even on NFT marketplaces, and
      future payments will be split based on the new slice distribution.
    </p>
  </>
)

export const section3 = (
  <>
    <h1>
      <DoubleText
        inactive
        logoText="Sell anything, on-chain"
        size="text-normal"
      />
    </h1>
    <p>
      Each slicer comes with a{" "}
      <b>decentralized store that can sell anything and accept any currency</b>.
    </p>
    <p>
      NFTs, event tickets, physical and digital items, merch, services,
      allowlisted drops, or interact with other protocols.{" "}
      <b>Fully on-chain.</b>
    </p>
    <Link href="/slice">
      <a className="inline-flex items-center group highlight">
        <span>Start selling now</span>
        <div className="w-5 h-5 ml-1 transition-transform duration-150 group-hover:translate-x-1">
          <Arrow />
        </div>
      </a>
    </Link>
  </>
)

export const section4 = (
  <>
    <h1>
      Hold slices, <DoubleText inactive logoText="earn Ξ" size="text-normal" />
    </h1>
    <p>
      Payments are split by slicers transparently, which makes slices{" "}
      <b>the first tradable tokens with an objective value</b>.
    </p>
    <p>
      This opens up to many exciting use cases, with slicers acting as an{" "}
      <b>independent, decentralized payments infrastructure</b> and counterpart
      to real-world applications.
    </p>
  </>
)
