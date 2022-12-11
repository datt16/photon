declare module "photon-babylon" {
  export type MeshDataItemType = {
    name: string
    id: string
  }

  type NodeItemType = {
    id: string,
    child: MeshDataItemType[]
  }

  export interface SceneMeshData {
    [index: string]: NodeItemType
  }
}
