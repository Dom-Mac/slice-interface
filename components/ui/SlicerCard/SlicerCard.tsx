import Link from "next/link"
import fetcher from "@utils/fetcher"
import useSWR from "swr"
import { releaseEthToSlicer, TriggerRelease } from "lib/handlers/chain"
import BlockchainCall from "../BlockchainCall"
import { useEffect, useState } from "react"
import { LogDescription } from "ethers/lib/utils"
import formatNumber from "@utils/formatNumber"
import getLog from "@utils/getLog"
import Arrow from "@components/icons/Arrow"
import { ButtonRelease, CardImage, CopyAddress, InputCheckbox } from ".."
import UserVerified from "@components/icons/UserVerified"
import Immutable from "@components/icons/Immutable"
import { BigNumber, ethers } from "ethers"
import getEthFromWei from "@utils/getEthFromWei"
import ProductsBalance from "../ProductsBalance"
import { useSigner } from "wagmi"
import { useAddRecentTransaction } from "@rainbow-me/rainbowkit"
import { NewTransaction } from "@rainbow-me/rainbowkit/dist/transactions/transactionStore"
import { Currency } from "@prisma/client"
import { SlicerReduced } from "pages/slicer"
import { UnreleasedAmount } from "../SlicersList/SlicersList"
import QuestionMark from "@components/icons/QuestionMark"

type Props = {
  slicerId: number
  slicerAddress: string
  shares: number
  totalSlices: number
  protocolFee: number
  isAllowed: boolean
  isImmutable: boolean
  productsModuleBalance: string
  addRecentTransaction: (transaction: NewTransaction) => void
  unreleasedAmounts: UnreleasedAmount[]
  dbData: SlicerReduced
}

const SlicerCard = ({
  slicerId,
  slicerAddress,
  shares,
  totalSlices,
  protocolFee,
  isAllowed,
  isImmutable,
  productsModuleBalance,
  addRecentTransaction,
  unreleasedAmounts,
  dbData
}: Props) => {
  const { name, image } = dbData || {}
  const [updatedUnreleasedAmounts, setUpdatedUnreleasedAmounts] = useState()
  const [ethReleased, setEthReleased] = useState("")
  const slicerLink = `/slicer/${slicerId}`
  const slicerName = name || `Slicer #${slicerId}`
  const slicePercentage = Math.floor((shares / totalSlices) * 10000) / 100

  const [withdraw, setWithdraw] = useState(false)
  const [released, setReleased] = useState(false)
  const [success, setSuccess] = useState(false)
  const [logs, setLogs] = useState<LogDescription[]>()

  const unreleasedData = updatedUnreleasedAmounts || unreleasedAmounts

  return (
    <div className="sm:flex">
      <CardImage
        href={slicerLink}
        name={slicerName}
        topLeft={
          isImmutable && {
            title: "Immutable asset",
            content: (
              <Immutable className="py-2 text-indigo-600 w-[38px] h-[38px]" />
            ),
            padding: "px-4"
          }
        }
        topRight={
          isAllowed && {
            title: "Superowner",
            content: (
              <UserVerified className="text-green-500 py-2 w-[38px] h-[38px]" />
            ),
            padding: "px-4"
          }
        }
        bottomLeft={{
          className: "text-black",
          content: slicerAddress ? (
            <CopyAddress
              slicerAddress={slicerAddress}
              showIcon={false}
              position="left-0 bottom-[40px]"
            />
          ) : (
            <div className="w-24 h-4 rounded-md bg-sky-300 animate-pulse" />
          ),
          clickable: false
        }}
        bottomRight={{
          title: "Total slices",
          content: `${formatNumber(totalSlices)} 🍰`,
          className: "text-black text-sm font-medium"
        }}
        imageUrl={image}
      />
      <div className="pt-4 sm:pt-1 sm:ml-6 md:ml-14">
        <div>
          <Link href={slicerLink}>
            <a className="flex items-center">
              {dbData ? (
                <h3 className="inline-block">{slicerName}</h3>
              ) : (
                <div className="w-32 h-6 mb-2 rounded-md bg-sky-300 animate-pulse" />
              )}
              <p className="h-full ml-3 text-sm font-normal text-gray-500">
                #{slicerId}
              </p>
            </a>
          </Link>
          <div className="space-y-2 text-gray-700">
            <div className="flex items-center">
              <p className="text-sm">
                {formatNumber(shares, 3)} slices owned ({slicePercentage})%
              </p>
              <Link href={`/transfer?id=${slicerId}`}>
                <a className="flex items-center ml-3 group">
                  <p className="text-sm ">Transfer</p>
                  <div className="w-5 h-5 ml-1 transition-transform duration-150 group-hover:translate-x-1">
                    <Arrow />
                  </div>
                </a>
              </Link>
            </div>
          </div>
          <ProductsBalance
            slicerId={slicerId}
            productsModuleBalance={productsModuleBalance}
            unreleasedAmounts={unreleasedAmounts}
            setUpdatedUnreleasedAmounts={setUpdatedUnreleasedAmounts}
          />
        </div>
        {dbData && unreleasedData && (
          <div className="inline-block p-3 mt-3 space-y-3 bg-gray-100 rounded-sm">
            <div className="flex justify-between text-sm">
              <div className="flex items-center gap-1">
                <p>Release</p> <QuestionMark className="w-4 h-4" />
              </div>
              <div className="flex items-center gap-1">
                <p>+ Withdraw</p> <QuestionMark className="w-4 h-4" />
              </div>
            </div>
            {unreleasedData.map((unreleasedAmount, i) => (
              <ButtonRelease
                slicerAddress={slicerAddress}
                unreleasedAmount={unreleasedAmount}
                addRecentTransaction={addRecentTransaction}
                key={i}
              />
            ))}
            <p className="text-sm underline">See all</p>
          </div>
        )}

        {/* {!released && unreleasedAmount && Number(unreleasedAmount) != 0 ? (
          <div className="mt-6">
            <BlockchainCall
              transactionDescription={`Release ETH | Slicer #${slicerId}`}
              saEventName="withdraw_eth_to_owner"
              label={`Release ${getEthFromWei(unreleasedAmount)} ETH`}
              action={() =>
                TriggerRelease(
                  signer,
                  slicerId,
                  account,
                  ethers.constants.AddressZero,
                  false
                )
              }
              success={success}
              setSuccess={setSuccess}
              setLogs={setLogs}
              mutateUrl={`/api/account/${account}/unreleased`}
              mutateObj={{ unreleased: 0 }}
            />
          </div>
        ) : null} */}
        {ethReleased != "" && (
          <p className="pt-4 text-sm text-green-500">
            You have released{" "}
            <span className="font-medium">{ethReleased} ETH</span>, check{" "}
            <Link href="/earnings">
              <a className="text-green-500 underline">your earnings</a>
            </Link>{" "}
            to withdraw them!
          </p>
        )}
      </div>
    </div>
  )
}

export default SlicerCard
