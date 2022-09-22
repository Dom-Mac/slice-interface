import { NewImage } from "pages/slicer/[id]"
const reduce = require("image-blob-reduce")()

const supabaseUpload = async (
  name: string,
  newImage: NewImage,
  currentImageUrl = "",
  highQuality = false
) => {
  const supabase = (await import("lib/supabase")).default
  const fetcher = (await import("@utils/fetcher")).default

  const supabaseStorage = process.env.NEXT_PUBLIC_SUPABASE_STORAGE_NAME
  const { supabaseKey } = await fetcher("/api/supabase")
  const fileExt = newImage.file.name.split(".").pop()
  const randomString = Math.random().toString(36).slice(4)

  const nameArr = name.split("/")
  const unformattedFilename = nameArr.pop()
  nameArr.push(
    unformattedFilename.replaceAll(/[^a-zA-Z0-9]/g, "").trim() +
      `_${randomString}`
  )
  const filename = nameArr.join("/")

  let mainImage: File
  // IMAGE COMPRESSION
  if (fileExt !== "gif") {
    if (highQuality) {
      mainImage = await reduce.toBlob(newImage.file, { max: 2560 })
    } else {
      mainImage = await reduce.toBlob(newImage.file, { max: 1280 })
    }
  } else {
    // TODO: Compress gif before upload
    mainImage = newImage.file
  }
  const { data, error } = await supabase(supabaseKey)
    .storage.from(supabaseStorage)
    .upload(`${filename}.${fileExt}`, mainImage, {
      cacheControl: "3600",
      upsert: false
    })
  if (error) {
    throw Error(error.message)
  }

  const blurredImage = await reduce.toBlob(newImage.file, { max: 4 })
  await supabase(supabaseKey)
    .storage.from(supabaseStorage)
    .upload(`${filename}_blur.${fileExt}`, blurredImage, {
      cacheControl: "3600",
      upsert: false
    })

  if (
    currentImageUrl &&
    currentImageUrl !== "https://slice.so/slicer_default.png"
  ) {
    const currentImageName = currentImageUrl.split(`${supabaseStorage}/`).pop()
    const body = {
      method: "POST",
      body: JSON.stringify({
        url: currentImageName
      })
    }
    await fetcher(`/api/slicer/delete_file`, body)
  }
  return data
}

export default supabaseUpload
