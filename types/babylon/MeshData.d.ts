declare module "photon-babylon" {
  export type MeshDataItemType =
    | "MESH"
    | "CAMERA"
    | "NODE"
    | "LIGHT"
    | "LINE_MESH"
    | "NONE"
  export interface MeshDataItem {
    name: string
    id: string
    type: MeshDataItemType
  }

  type NodeItemType = {
    id: string
    child: MeshDataItem[]
  }

  export interface SceneMeshData {
    [index: string]: NodeItemType
  }
}
