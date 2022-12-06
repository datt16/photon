import { Color3, Color4, MeshBuilder, Node, Scene, TransformNode, Vector3 } from "@babylonjs/core"
import { range } from "../util"

const drawAxisLines = (scene: Scene) => {
  const node = new TransformNode("gizmo", scene)

  const dataset = [
    {
      name: "x",
      vertex: [Vector3.Zero(), new Vector3(200, 0, 0)],
      color: new Color3(1, 0, 0)
    },
    {
      name: "y",
      vertex: [Vector3.Zero(), new Vector3(0, 200, 0)],
      color: new Color3(0, 1, 0)
    },
    {
      name: "z",
      vertex: [Vector3.Zero(), new Vector3(0, 0, 200)],
      color: new Color3(0, 0, 1)
    },
  ]

  dataset.map((item) => {
    const line = MeshBuilder.CreateLines(
      item.name,
      { points: item.vertex, updatable: false },
      scene
    )
    line.parent = node
    line.color = item.color
  })
}

const drawGrid = (
  scene: Scene,
  limit: number = 100,
  distance: number = 1,
  isVisible: boolean = true
) => {
  if (!isVisible) return

  const linePointsBase = range(0, limit * 2, distance)
  const gridColor = new Color3(0.5, 0.5, 0.5)

  const gridX = new TransformNode("gridX", scene)
  const gridZ = new TransformNode("gridZ", scene)

  const axisX = MeshBuilder.CreateLines(
    "Grid-X",
    {
      points: [new Vector3(0, 0, -1 * limit), new Vector3(0, 0, limit)],
      updatable: false,
    },
    scene
  )
  axisX.position = new Vector3(-100, 0, 0)
  axisX.color = gridColor
  linePointsBase.forEach((p, index) => {
    const clone = axisX.clone(`Grid-X-${index}`, gridX)
    clone.position = new Vector3(p - limit, 0, 0)
  })
  axisX.dispose()

  const axisZ = MeshBuilder.CreateLines(
    "Grid-Z",
    {
      points: [new Vector3(-1 * limit, 0, 0), new Vector3(limit, 0, 0)],
      updatable: false,
    },
    scene
  )
  axisZ.position = new Vector3(0, 0, -1 * limit)
  axisZ.color = gridColor
  linePointsBase.forEach((p, index) => {
    const clone = axisZ.clone(`Grid-Z-${index}`, gridZ)
    clone.position = new Vector3(0, 0, p - limit)
  })
  axisZ.dispose()
}

export { drawAxisLines, drawGrid }
