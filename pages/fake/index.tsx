import { Button, Text } from "@chakra-ui/react"
import { ChangeEventHandler, useState } from "react"

import useFileHandler from "../../features/experimental/hooks/useFileHandler"

const useFile = () => {
  const [fileURL, setFileURL] = useState<string>()
  const [fileName, setFileName] = useState<string>("")
  const handleFiles: ChangeEventHandler<HTMLInputElement> = (event) => {
    const files = event.currentTarget.files
    if (!files || files?.length === 0) return
    const url = window.URL.createObjectURL(files[0])
    setFileURL(url)
    setFileName(files[0].name)
  }
  return { handleFiles, fileURL, fileName }
}

const Page = () => {
  const { handleFiles } = useFile()
  const { readFile, file } = useFileHandler()

  return (
    <>
      <Text fontSize={"lg"}>File Pick Test</Text>
      <input type={"file"} onChange={handleFiles} />

      <Button onClick={readFile}>readFile</Button>

      <p>{file}</p>
    </>
  )
}

export default Page
