import { Text } from "@chakra-ui/react"
import Image from "next/image"
import { ChangeEventHandler, useState } from "react"

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
  console.log(fileURL)
  return { handleFiles, fileURL, fileName }
}

const Page = () => {
  const { handleFiles, fileURL } = useFile()
  return (
    <>
      <Text fontSize={"lg"}>File Pick Test</Text>
      <input type={"file"} onChange={handleFiles} />
    </>
  )
}

export default Page
