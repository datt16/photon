import axios, { AxiosRequestConfig } from "axios"
import { ChangeEventHandler, useState } from "react"
import { UPLOAD_FILE_FORM_FIELD_NAME } from "../../../const/const"

const useFile = () => {
  const [fileURL, setFileURL] = useState<string>()
  const [fileName, setFileName] = useState<string>()

  const handleFiles: ChangeEventHandler<HTMLInputElement> = async (event) => {
    const config: AxiosRequestConfig = {
      headers: { "Content-Type": "multipart/form-data" },
      onUploadProgress: (event) => {
        console.log(
          `Current progress:`,
          Math.round((event.loaded * 100) / event.total!)
        )
      },
    }

    if (!event.target.files?.length) {
      return
    }
    const formData: FormData = new FormData()
    Array.from(event.target.files).forEach((file, index) => {
      setFileName(file.name)
      formData.append(UPLOAD_FILE_FORM_FIELD_NAME, file)
    })

    const response = await axios.post("/api/uploads", formData, config)
    if (response.status == 200) {
      setFileURL(`/public/uploads/${fileName}`)
    }
  }
  return { handleFiles, fileURL, fileName }
}

export default useFile
