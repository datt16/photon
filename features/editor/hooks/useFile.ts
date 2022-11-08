import { ChangeEventHandler, useState } from "react"

const useFile = () => {
  const [fileURL, setFileURL] = useState<string>()
  const handleFiles: ChangeEventHandler<HTMLInputElement> = (event) => {
    const files = event.currentTarget.files
    if (!files || files?.length === 0) return
    const url = window.URL.createObjectURL(files[0])
    setFileURL(url)
    console.log(files[0].name)
  }
  console.log(fileURL)
  return { handleFiles, fileURL }
}

export default useFile
