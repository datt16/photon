declare module "photon-babylon" {
  export type MeshDataItemType =
    | "MESH"
    | "CAMERA"
    | "NODE"
    | "LIGHT"
    | "LINE_MESH"
    | "NONE"
    | "GIZMOS"
    | "GRID"

  export interface MeshDataItem {
    name: string
    uid: number
    type: MeshDataItemType
    isInspectorVisible: boolean
  }

  type NodeItemType = {
    name: string
    uid: number
    isInspectorVisible: boolean
    child: MeshDataItem[]
  }

  export interface SceneMeshData {
    [index: string]: NodeItemType
  }
}
