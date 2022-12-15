import { SceneMeshData } from "photon-babylon"
import { atom } from "recoil"
import { AtomKeys } from "../recoilKeys"

export const meshListState = atom<SceneMeshData>({
  key: AtomKeys.MESH_LIST_STAte,
  default: {},
})
