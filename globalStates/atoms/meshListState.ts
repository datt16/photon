import { AbstractMesh } from "@babylonjs/core"
import { atom } from "recoil"
import { AtomKeys } from "../recoilKeys"

type meshData = {
    name: string,
    key: string
}


export const meshListState = atom<[]>({
    key: AtomKeys.MESH_LIST_STAte,
    default: [],
})
