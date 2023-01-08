import { ChangeEventHandler, useState } from "react"

const useAssetLoad = () => {
  const [assetUrl, setAssetUrl] = useState("")
  const [assetType, setAssetType] = useState("")

  const handleSingle3dFileInput: ChangeEventHandler<HTMLInputElement> = (
    event
  ) => {
    if (!event.target.files?.length) {
      return
    }
    const file = event.target.files[0]
    const type = file.name.split(".").at(-1)

    if (type == undefined) {
      console.warn("対応していない形式のファイルです", file.name)
      return
    } else if (!["glb", "gltf", "obj", "stl", "babylon"].includes(type)) {
      console.warn("対応していない形式のファイルです", file.name)
      return
    }

    setAssetUrl(URL.createObjectURL(file))
    setAssetType(`.${type}`)
  }

  return { handleSingle3dFileInput, assetUrl, assetType }
}

export default useAssetLoad
