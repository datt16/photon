import { AbstractMesh } from "@babylonjs/core"
import { atom } from "recoil"
import { AtomKeys } from "../recoilKeys"

export const meshListState = atom<string[]>({
    key: AtomKeys.MESH_LIST_STAte,
    default: [],
})
