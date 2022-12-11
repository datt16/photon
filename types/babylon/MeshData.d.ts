declare module "photon-babylon" {
  export type MeshDataItem = {
    name: string
    id: string
  }

  export interface SceneMeshData {
    [index: string]: MeshDataItem[]
  }
}
