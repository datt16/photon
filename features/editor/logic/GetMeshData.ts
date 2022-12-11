import { Node } from "@babylonjs/core"
import { MeshDataItem, SceneMeshData } from 'photon-babylon'

let nodes: SceneMeshData = {}
const getMeshData = (rootNodes: Node[]): {} => {

    let childNode: MeshDataItem[] = []

    rootNodes.forEach((item) => {
        const child = item.getChildren()
        const key = item.parent?.name ? item.parent?.name : "__root__"

        if (child[0] == undefined) {
            childNode.push({
                name: item.name,
                id: item.uniqueId.toString()
            })
            nodes[key] = childNode
        }
        else {
            nodes[key] = childNode
            getMeshData(child)
        }
    })

    return nodes
}

export default getMeshData