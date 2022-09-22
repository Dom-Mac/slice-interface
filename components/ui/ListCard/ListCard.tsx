import Link from "next/link"
import Delete from "@components/icons/Delete"
import React from "react"
import Bolt from "@components/icons/Bolt"
import { ethers } from "ethers"

type Props = {
  label: string
  sideLabel: string
  subLabel: string
  externalAddress: string
  href?: string
  remove?: () => void
}

const ListCard = ({
  label,
  sideLabel,
  subLabel,
  href,
  remove,
  externalAddress
}: Props) => {
  const content = (
    <div className="grid items-center h-16 grid-cols-5 pl-4 pr-2 bg-white border border-gray-100 shadow-base rounded-xl">
      <div className="flex justify-center text-xs text-center">{sideLabel}</div>
      <div className="col-span-3 px-1 ml-2 text-left">
        <p className="text-sm font-medium truncate sm:text-base">{label}</p>
        <div className="flex items-center">
          <p className="text-sm text-gray-400">{subLabel}</p>
          {externalAddress != ethers.constants.AddressZero && (
            <div className="w-4 h-4 ml-2 text-yellow-500 animate-pulse">
              <Bolt />
            </div>
          )}
        </div>
      </div>
      <div className="flex justify-center">
        <Delete
          onClick={(e: React.SyntheticEvent) => {
            e.preventDefault()
            remove()
          }}
        />
      </div>
    </div>
  )
  return (
    <div>
      {href ? (
        <Link href={href}>
          <a>{content}</a>
        </Link>
      ) : (
        content
      )}
    </div>
  )
}

export default ListCard
