import { atom } from "recoil"
import { AtomKeys } from "../recoilKeys"

export const pickModeState = atom<"gizmo" | "annotate">({
  key: AtomKeys.PICK_MODE_STATE,
  default: "gizmo",
})
