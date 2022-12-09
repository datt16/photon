import { Node } from "@babylonjs/core"

type meshData = {
    name: string,
    key: string
}

let nodes: any = {}
const getMeshData = (rootNodes: Node[], parentName?: string): {} => {

    let childNode: meshData[] = []

    rootNodes.forEach((item) => {
        const child = item.getChildren()
        const key = item.parent?.name ? item.parent?.name : "__root__"

        if (child[0] == undefined) {
            childNode.push({
                name: item.name,
                key: item.uniqueId.toString()
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