import {
  Camera,
  Light,
  LinesMesh,
  Mesh,
  Node,

} from "@babylonjs/core"
import { MeshDataItem, MeshDataItemType, SceneMeshData } from "photon-babylon"
import { photonConst } from "../../../const/const"

let nodes: SceneMeshData = {}

const getMeshData = (rootNodes: Node[]): {} => {
  let childNode: MeshDataItem[] = []

  rootNodes.forEach((item) => {
    const child = item.getChildren()
    const key = item.parent?.name ? item.parent?.name : "__root__"

    if (child[0] == undefined) {

      childNode.push(
        MeshDataFactory(
          item.name,
          item.uniqueId.toString(),
          item.name.includes(photonConst.Prefix.PREFIX_3DUI_GIZMO) ? "GIZMOS" :
            item.name.includes(photonConst.Prefix.PREFIX_3DUI_GRID) ? "GRID" :
              item instanceof LinesMesh
                ? "LINE_MESH"
                : item instanceof Camera
                  ? "CAMERA"
                  : item instanceof Light
                    ? "LIGHT"
                    : item instanceof Mesh
                      ? "MESH"
                      : "NONE"
        )
      )
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

const MeshDataFactory = (
  name: string,
  id: string,
  type: MeshDataItemType,
  isInspectorVisible?: boolean
): MeshDataItem => {

  return {
    name,
    id,
    type,
    isInspectorVisible: isInspectorVisible ? isInspectorVisible : !["GIZMOS", "GRID"].includes(type)
  }

}

export default getMeshData
