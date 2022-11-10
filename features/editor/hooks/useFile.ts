import { ChangeEventHandler, useState } from "react"

const useFile = () => {
  const [fileURL, setFileURL] = useState<string>()
  const [fileName, setFileName] = useState<string>()

  const handleFiles: ChangeEventHandler<HTMLInputElement> = (event) => {
    const files = event.currentTarget.files
    if (!files || files?.length === 0) return
    const url = window.URL.createObjectURL(files[0])
    setFileURL(url)
    setFileName(files[0].name)
  }
  return { handleFiles, fileURL, fileName }
}

export default useFile
