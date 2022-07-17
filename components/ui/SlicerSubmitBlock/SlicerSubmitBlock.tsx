import { Dispatch, SetStateAction, useEffect, useState } from "react"
import useSWR from "swr"
import { NewImage, SlicerData } from "pages/slicer/[id]"
import fetcher from "@utils/fetcher"
import { Message } from "@utils/handleMessage"
import { useAppContext } from "../context"
import { Button, MessageBlock } from "@components/ui"
import openFingerprintingModal from "@utils/openFingerprintingModal"

type Props = {
  editMode: boolean
  setEditMode: Dispatch<SetStateAction<boolean>>
  slicerInfo: any
  slicer: SlicerData
  setSlicer: Dispatch<SetStateAction<SlicerData>>
  loading: boolean
  setLoading: Dispatch<SetStateAction<boolean>>
  newName: any
  setNewName: Dispatch<SetStateAction<any>>
  newDescription: any
  setNewDescription: Dispatch<SetStateAction<any>>
  newTags: string
  setNewTags: Dispatch<SetStateAction<string>>
  newImage: NewImage
  setNewImage: Dispatch<SetStateAction<NewImage>>
  setTempImageUrl: Dispatch<SetStateAction<string>>
  msg: Message
  setMsg: Dispatch<SetStateAction<Message>>
}

const SlicerSubmitBlock = ({
  editMode,
  setEditMode,
  slicerInfo,
  slicer,
  setSlicer,
  loading,
  setLoading,
  newName,
  setNewName,
  newDescription,
  setNewDescription,
  newTags,
  setNewTags,
  newImage,
  setNewImage,
  setTempImageUrl,
  msg,
  setMsg
}: Props) => {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL

  const hexId = Number(slicerInfo?.id).toString(16)
  const { data: slicerInfoUpdated } = useSWR(
    editMode ? `/api/slicer/${hexId}?stats=false` : null,
    fetcher
  )

  const { account, provider, setModalView } = useAppContext()
  const [preventSubmit, setPreventSubmit] = useState(false)
  const [tempStorageUrl, setTempStorageUrl] = useState("")

  const openPopup = () => {
    setModalView({ name: "IRREVERSIBLE_VIEW" })
    setPreventSubmit(false)
  }

  const updateDb = async (newInfo: SlicerData) => {
    setSlicer(newInfo)
    const body = {
      method: "POST",
      body: JSON.stringify(newInfo)
    }
    await fetcher(`/api/slicer/${hexId}`, body)
  }

  const save = async () => {
    const { mutate } = await import("swr")
    const handleMessage = (await import("@utils/handleMessage")).default
    const slicerContract = (await import("@lib/initProvider")).slicer
    const supabaseUpload = (await import("@utils/supabaseUpload")).default

    setLoading(true)
    let newInfo: SlicerData = {
      name: newName,
      tags: newTags,
      description: newDescription,
      imageUrl: slicer.imageUrl,
      attributes: slicer.attributes
    }
    try {
      const contract = await slicerContract(slicerInfo?.id, provider)
      const isPayeeAllowed = await contract.isPayeeAllowed(account)
      if (!isPayeeAllowed) {
        throw Error("Payee is not allowed")
      }
      if (newImage.url) {
        setTempImageUrl(newImage.url)

        const { Key } = await supabaseUpload(
          `${slicerInfo?.id}/main`,
          newImage,
          slicer.imageUrl,
          slicerInfo?.isImmutable
        )

        // Todo? If isImmutable store on web3Storage

        const newFilePath = `${supabaseUrl}/storage/v1/object/public/${Key}`
        setTempStorageUrl(newFilePath)
        newInfo = {
          name: newName,
          tags: newTags,
          description: newDescription,
          imageUrl: newFilePath,
          attributes: slicer.attributes
        }
        await updateDb(newInfo)
        mutate(`/api/slicer/${hexId}?stats=false`)
        setNewImage({ url: "", file: undefined })
        setEditMode(false)
        setLoading(false)
      } else {
        await updateDb(newInfo)
        await fetcher(`/api/slicer/${slicerInfo.id}/refresh`)
        setEditMode(false)
        setLoading(false)
      }
    } catch (err) {
      console.log(err.message)
      setLoading(false)
      handleMessage(
        {
          message:
            err.message === "Payee is not allowed"
              ? err.message
              : "Something went wrong, try again",
          messageStatus: "error"
        },
        setMsg
      )
      openFingerprintingModal(err, setModalView)
    }
  }

  const cancel = () => {
    setNewName(slicer.name)
    setNewDescription(slicer.description)
    setNewTags(slicer.tags)
    setNewImage({ url: "", file: undefined })
    setEditMode(false)
  }

  useEffect(() => {
    if (slicerInfo?.isImmutable) {
      setPreventSubmit(true)
    }
  }, [slicerInfo])

  useEffect(() => {
    if (!tempStorageUrl && slicerInfoUpdated?.imageUrl) {
      setTempStorageUrl(slicerInfoUpdated?.imageUrl)
    }
  }, [slicerInfoUpdated])

  return (
    <div>
      <div className="pb-8">
        <Button
          label="Save"
          loading={loading}
          onClick={() => (preventSubmit ? openPopup() : save())}
        />
      </div>
      {!loading && (
        <p
          className="inline-block font-medium text-red-500 cursor-pointer hover:underline"
          onClick={() => cancel()}
        >
          Cancel
        </p>
      )}
      <MessageBlock msg={msg} />
    </div>
  )
}

export default SlicerSubmitBlock
