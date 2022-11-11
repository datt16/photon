import { atom } from "recoil"
import { AtomKeys } from "../recoilKeys"

export const fileUploadState = atom<boolean>({
  key: AtomKeys.FILE_UPLOAD_STATE,
  default: false,
})
