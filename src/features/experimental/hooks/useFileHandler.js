import { useState } from "react"

const useFileHandler = () => {
  const [file, setFile] = useState()
  let fileHandle

  const readFile = async () => {
    ;[fileHandle] = await window.showOpenFilePicker()
    const file = await fileHandle.getFile()
    const fileContents = await file.text()
    setFile(fileContents)
  }

  return { readFile, file }
}

export default useFileHandler
