import axios, { AxiosRequestConfig } from "axios"
import { ChangeEventHandler, Ref, useEffect, useState } from "react"
import { useSetRecoilState } from "recoil"
import { photonConst } from "../../../const/const"

import { fileUploadState } from "../../../globalStates/atoms/fileUploadState"

const useFile = () => {
  const setIsUploading = useSetRecoilState(fileUploadState)
  const [destURL, setDestURL] = useState<string>()
  const [fileName, setFileName] = useState<string>()
  const [formData, setFormData] = useState<FormData>()

  const handleFiles: ChangeEventHandler<HTMLInputElement> = (event) => {
    if (!event.target.files?.length) {
      return
    }
    const formData: FormData = new FormData()
    Array.from(event.target.files).forEach((file, index) => {
      formData.append(photonConst.Upload.UPLOAD_FILE_FORM_FIELD_NAME, file)
    })
    setFormData(formData)

    setIsUploading(true)
  }

  const config: AxiosRequestConfig = {
    headers: { "Content-Type": "multipart/form-data" },
    onUploadProgress: (event) => {
      console.log(
        `Current progress:`,
        Math.round((event.loaded * 100) / event.total!)
      )
    },
  }

  useEffect(() => {
    async function uploadFile() {
      if (!formData) return
      await axios.post("/api/uploads", formData, config).then((response) => {
        if (response.status !== 200) return

        if (response.data.fileName && response.data.folderPath) {
          setFileName(response.data.fileName)
          setDestURL(response.data.folderPath)
          setIsUploading(false)
        }
      })
    }
    uploadFile()
  }, [formData])

  return { handleFiles, destURL, fileName }
}

export default useFile
