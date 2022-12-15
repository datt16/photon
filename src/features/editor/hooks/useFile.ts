import axios, { AxiosProgressEvent } from "axios"
import { ChangeEventHandler, useEffect, useMemo, useState } from "react"
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
    Array.from(event.target.files).forEach((file) => {
      formData.append(photonConst.UPLOAD_FILE_FORM_FIELD_NAME, file)
    })
    setFormData(formData)

    setIsUploading(true)
  }

  const config = useMemo(() => {
    return {
      headers: { "Content-Type": "multipart/form-data" },
      onUploadProgress: (event: AxiosProgressEvent) => {
        console.log(
          `Current progress:`,
          event.total ? Math.round((event.loaded * 100) / event.total) : null
        )
      },
    }
  }, [])

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
  }, [config, formData, setIsUploading])

  return { handleFiles, destURL, fileName }
}

export default useFile
