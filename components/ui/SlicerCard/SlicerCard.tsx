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
import { CardImage, CopyAddress } from ".."
import UserVerified from "@components/icons/UserVerified"
import Immutable from "@components/icons/Immutable"
import { ethers } from "ethers"
import getEthFromWei from "@utils/getEthFromWei"
import ProductsBalance from "../ProductsBalance"
import { useSigner } from "wagmi"

type SlicerInfo = {
  name: string
  address: string
  image: string
}

type Props = {
  slicerId: number
  slicerAddress: string
  shares: number
  totalSlices: number
  protocolFee: number
  account: string
  isAllowed: boolean
  isImmutable: boolean
  productsModuleBalance: string
  unreleasedAmount: string
}

const SlicerCard = ({
  slicerId,
  slicerAddress,
  account,
  shares,
  totalSlices,
  protocolFee,
  isAllowed,
  isImmutable,
  productsModuleBalance,
  unreleasedAmount
}: Props) => {
  const { data: signer } = useSigner()

  const hexId = Number(slicerId).toString(16)
  const { data: slicerInfo } = useSWR(
    `/api/slicer/${hexId}?stats=false`,
    fetcher
  )

  const { name, image }: SlicerInfo = slicerInfo || {
    name: null,
    image: null
  }

  const [ethReleased, setEthReleased] = useState("")
  const [released, setReleased] = useState(false)
  const [success, setSuccess] = useState(false)
  const [logs, setLogs] = useState<LogDescription[]>()
  const slicerLink = `/slicer/${slicerId}`
  const slicerName = name || `Slicer #${slicerId}`
  const slicePercentage = `${Math.floor((shares / totalSlices) * 10000) / 100}%`

  useEffect(() => {
    if (success) {
      setEthReleased(String(getEthFromWei(unreleasedAmount)))
      setReleased(true)
    }
  }, [success])

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
      <div className="pt-5 sm:pt-4 sm:ml-6 md:ml-14">
        <Link href={slicerLink}>
          <a className="flex items-center">
            {slicerInfo ? (
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
              {formatNumber(shares, 3)} slices owned ({slicePercentage})
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
        />
        {!released && unreleasedAmount && Number(unreleasedAmount) != 0 ? (
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
        ) : null}
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
