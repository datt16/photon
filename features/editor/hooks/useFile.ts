import axios, { AxiosRequestConfig } from "axios"
import { ChangeEventHandler, useState } from "react"
import { useRecoilState } from "recoil"
import { UPLOAD_FILE_FORM_FIELD_NAME } from "../../../const/const"
import { fileUploadState } from "../../../globalStates/atoms/fileUploadState"

const useFile = (setIsUploading: (state: boolean) => void) => {
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
      formData.append(UPLOAD_FILE_FORM_FIELD_NAME, file)
    })

    const url = `/uploads/${event.target.files[0].name}`
    setFileURL(url)

    setIsUploading(true)
    await axios.post("/api/uploads", formData, config).then((response) => {
      if (response.status == 200) {
        setIsUploading(false)
      }
    })
  }
  return { handleFiles, fileURL, fileName }
}

export default useFile
