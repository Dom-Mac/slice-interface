import { Dispatch, SetStateAction, useState } from "react"
import {
  Input,
  SlicerImageBlock,
  MessageBlock,
  InputTags,
  Textarea
} from "@components/ui"
import { NewImage } from "pages/slicer/[id]"
import { Message } from "@utils/handleMessage"

// const tagsList = ["product", "service", "other"]

type Props = {
  slicerId: number
  name: string
  description: string
  shortDescription: string
  newImage: NewImage
  setName: Dispatch<SetStateAction<string>>
  setDescription: Dispatch<SetStateAction<string>>
  setShortDescription: Dispatch<SetStateAction<string>>
  // setTags: Dispatch<SetStateAction<string[]>>
  setNewImage: Dispatch<SetStateAction<NewImage>>
}

const AddProductFormGeneral = ({
  slicerId,
  name,
  shortDescription,
  description,
  newImage,
  setName,
  setShortDescription,
  setDescription,
  // setTags,
  setNewImage
}: Props) => {
  // const { data: versionData } = useSWR(
  //   name ? `/api/slicer/${slicerId}/products?name=${name}` : null,
  //   fetcher
  // )
  // const [version, setVersion] = useState(0)
  const [msg, setMsg] = useState<Message>({
    message: "",
    messageStatus: "success"
  })

  // useEffect(() => {
  //   if (versionData) {
  //     setVersion(versionData.data + 1)
  //   }
  // }, [versionData])

  return (
    <>
      <div className="relative">
        <Input
          label="Name*"
          placeholder="What are you selling?"
          type="string"
          value={name}
          onChange={setName}
          required
        />
        {/* {name && version != 0 && (
          <div
            className={
              "absolute top-0 right-0 flex items-center h-full pb-0.5 mr-8 pt-7"
            }
          >
            <p className="text-sm text-blue-600">v{version}</p>
          </div>
        )} */}
      </div>
      <div>
        <Input
          label="Short description (max 70 char)"
          maxLength={70}
          type="string"
          value={shortDescription}
          onChange={setShortDescription}
        />
      </div>
      <div>
        <Textarea
          label="Description*"
          placeholder="Describe the product to customers. What will they get for buying it?"
          value={description}
          onChange={setDescription}
          rows={5}
          required
        />
      </div>
      {/* <InputTags tags={tagsList} setTags={setTags} /> */}
      <SlicerImageBlock
        name={name}
        newImage={newImage}
        setNewImage={setNewImage}
        label="Image"
        upload={true}
        msg={msg}
        setMsg={setMsg}
        loading={false}
        maxHeight="max-h-[260px] sm:max-h-[320px]"
        product
      />
      <p className="pt-3 text-yellow-600">
        <b>You cannot change the name, description and image later.</b>
      </p>

      <MessageBlock msg={msg} />
      <div>
        <hr className="w-20 mx-auto my-16 border-gray-300" />
      </div>
    </>
  )
}

export default AddProductFormGeneral
