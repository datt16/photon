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
    id: string
    type: MeshDataItemType
    isInspectorVisible: boolean
  }

  type NodeItemType = {
    id: string
    child: MeshDataItem[]
  }

  export interface SceneMeshData {
    [index: string]: NodeItemType
  }
}
