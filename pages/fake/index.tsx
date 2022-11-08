import { Text } from "@chakra-ui/react"
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

const Page = () => {
  const { handleFiles, fileURL } = useFile()
  return (
    <>
      <img src={fileURL}></img>
      <Text fontSize={"lg"}>File Pick Test</Text>
      <input type={"file"} onChange={handleFiles} />
    </>
  )
}

export default Page
