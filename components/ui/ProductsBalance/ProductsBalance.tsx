import Arrow from "@components/icons/Arrow"
import QuestionMark from "@components/icons/QuestionMark"
import { releaseEthToSlicer } from "@lib/handlers/chain"
import { useAddRecentTransaction } from "@rainbow-me/rainbowkit"
import getEthFromWei from "@utils/getEthFromWei"
import handleSubmit from "@utils/handleSubmit"
import saEvent from "@utils/saEvent"
import { BigNumber, ethers } from "ethers"
import { Dispatch, SetStateAction, useState } from "react"
import { useSigner } from "wagmi"
import { UnreleasedAmount } from "../SlicersList/SlicersList"

type Props = {
  slicerId: number
  productsModuleBalance: string
  unreleasedAmounts: UnreleasedAmount[]
  setUpdatedUnreleasedAmounts: Dispatch<SetStateAction<UnreleasedAmount[]>>
}

const ProductsBalance = ({
  slicerId,
  productsModuleBalance,
  unreleasedAmounts,
  setUpdatedUnreleasedAmounts
}: Props) => {
  const { data: signer } = useSigner()
  const addRecentTransaction = useAddRecentTransaction()

  const [show, setShow] = useState(false)
  const [loading, setLoading] = useState(false)

  const executeRelease = async () => {
    saEvent("release_eth_to_slicer_attempt")
    setLoading(true)
    const eventLogs = await handleSubmit(
      releaseEthToSlicer(signer, slicerId),
      null,
      setLoading,
      null,
      true,
      addRecentTransaction,
      `Release store earnings | Slicer #${slicerId}`
    )
    if (eventLogs) {
      saEvent("release_eth_to_slicer_success")
      const newAmounts = [...unreleasedAmounts]
      // ETH is always at index 0
      newAmounts[0] = {
        currency: ethers.constants.AddressZero,
        amount: BigNumber.from(productsModuleBalance).add(
          unreleasedAmounts[0].amount
        ),
        symbol: "ETH",
        quote: unreleasedAmounts[0].quote
      }
      setUpdatedUnreleasedAmounts(newAmounts)
    } else {
      saEvent("release_eth_to_slicer_fail")
    }
  }

  return productsModuleBalance?.length > 1 ? (
    <div className="relative flex flex-wrap items-center text-sm">
      {!loading ? (
        <>
          <p>
            Sales profits:{" "}
            <span className="font-medium text-black">
              {getEthFromWei(productsModuleBalance)} ETH
            </span>
          </p>
          <div
            className="inline-block pt-3 mx-2 mb-3"
            onMouseEnter={() => setShow(true)}
            onMouseLeave={() => setShow(false)}
          >
            <QuestionMark className="w-4 h-4" />
            <div
              className={`${
                !show ? "hidden " : ""
              }prose-sm text-left absolute p-5 w-[22rem] z-10 xs:w-96 bg-white shadow-xl bottom-0 left-0 sm:-ml-28 md:-ml-8 lg:ml-0 mb-10 rounded-md overflow-hidden border border-blue-600 border-opacity-50`}
            >
              <p>
                ETH earnings coming from product purchases require an additional
                step before being released.
              </p>
              <p>
                <b>Send to slicer</b> directs the outstanding balance to your
                slicer, automatically distributing it to its owners. You will
                see your ETH balance updated once the transaction goes through.
              </p>
              <p>
                <b>Note:</b> This step is not necessary with ERC20 purchases.
              </p>
            </div>
          </div>
          <a
            className="flex items-center group"
            onClick={() => executeRelease()}
          >
            <p>Send to slicer</p>
            <div className="w-5 h-5 ml-1 transition-transform duration-150 group-hover:translate-x-1">
              <Arrow />
            </div>
          </a>
        </>
      ) : (
        <p>Sending ...</p>
      )}
    </div>
  ) : null
}

export default ProductsBalance
