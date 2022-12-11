import {
  Camera,
  Light,
  LinesMesh,
  Mesh,
  Node,

} from "@babylonjs/core"
import { MeshDataItem, SceneMeshData } from "photon-babylon"

let nodes: SceneMeshData = {}
const getMeshData = (rootNodes: Node[]): {} => {
  let childNode: MeshDataItem[] = []

  rootNodes.forEach((item) => {
    const child = item.getChildren()
    const key = item.parent?.name ? item.parent?.name : "__root__"

    if (child[0] == undefined) {
      childNode.push({
        name: item.name,
        id: item.uniqueId.toString(),
        type:
          item instanceof LinesMesh
            ? "LINE_MESH"
            : item instanceof Camera
            ? "CAMERA"
            : item instanceof Light
            ? "LIGHT"
            : item instanceof Mesh
            ? "MESH"
            : "NONE",
      })
      nodes[key] = {
        id: key,
        child: childNode,
      }
    } else {
      nodes[key] = {
        id: key,
        child: childNode,
      }
      getMeshData(child)
    }
  })

  return nodes
}

export default getMeshData
