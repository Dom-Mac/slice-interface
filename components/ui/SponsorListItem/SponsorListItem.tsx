import Delete from "@components/icons/Delete"
import Edit from "@components/icons/Edit"
import { useState } from "react"
import { Input } from ".."
import { useAppContext } from "../context"
import ResolvedAddress from "../ResolvedAddress"

type Sponsor = {
  address: string
  amount: number
}

type Props = {
  slicerId: string
  sponsor: Sponsor
  sponsorLink: string
}

const SponsorListItem = ({ slicerId, sponsor, sponsorLink }: Props) => {
  const { account } = useAppContext()
  const { address, amount } = sponsor
  const [link, setLink] = useState("")
  const [loading, setLoading] = useState(false)
  const [editSponsor, setEditSponsor] = useState(false)

  const updateSponsor = async () => {
    const fetcher = (await import("@utils/fetcher")).default

    setLoading(true)
    const body = {
      method: "POST",
      body: JSON.stringify({
        address,
        link
      })
    }
    await fetcher(`/api/slicer/${slicerId}/sponsor`, body)
    if (!link.includes("://")) {
      setLink("https://" + link)
    }
    setLoading(false)
    setEditSponsor(false)
  }

  const handleReset = () => {
    setEditSponsor(false)
    setLink("")
  }

  return (
    <li className="flex justify-between">
      {editSponsor ? (
        <div className="flex items-center flex-grow">
          <a
            className="mt-8 mr-4 hover:text-red-500"
            onClick={() => handleReset()}
          >
            <Delete className="w-[22px] h-[22px]" />
          </a>
          <div className="flex-grow">
            <Input
              label="Sponsor link"
              placeholder={sponsorLink || "https://slice.so"}
              value={link}
              onChange={setLink}
              loading={loading}
              onClickLabel="Save"
              onClick={async () => await updateSponsor()}
              question={
                <>
                  <p>
                    You can add a link to redirect anyone clicking on your
                    address to a website.
                  </p>
                  <p>
                    <b>Note:</b> Make sure to prefix the link with
                    &quot;http://&quot; or &quot;https://&quot;
                  </p>
                </>
              }
            />
          </div>
        </div>
      ) : (
        <>
          <div className="flex items-center">
            <>
              <span className="mr-3">
                <ResolvedAddress
                  address={address}
                  href={
                    link ||
                    sponsorLink ||
                    `https://${
                      process.env.NEXT_PUBLIC_CHAIN_ID === "4" ? "rinkeby." : ""
                    }etherscan.io/address/${address}`
                  }
                />
              </span>
              {account?.toLowerCase() === address && (
                <a onClick={() => setEditSponsor(true)}>
                  <Edit className="w-[18px] h-[18px]" />
                </a>
              )}
            </>
          </div>
          <span>Ξ {amount}</span>
        </>
      )}
    </li>
  )
}

export default SponsorListItem
