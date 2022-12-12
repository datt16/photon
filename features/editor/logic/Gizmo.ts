import { Color3, Color4, MeshBuilder, Node, Scene, TransformNode, Vector3 } from "@babylonjs/core"
import { range } from "../util"
import { photonConst } from "../../../const/const"

const _3DUI = photonConst.Prefix.PREFIX_PHOTON_3DUI_ITEM
const _GRID = photonConst.Prefix.PREFIX_3DUI_GRID
const _GIZMO = photonConst.Prefix.PREFIX_3DUI_GIZMO

const drawAxisLines = (scene: Scene) => {
  const node = new TransformNode(_GIZMO, scene)

  const dataset = [
    {
      name: `${_3DUI}_${_GIZMO}_X`,
      vertex: [Vector3.Zero(), new Vector3(200, 0, 0)],
      color: new Color3(1, 0, 0)
    },
    {
      name: `${_3DUI}_${_GIZMO}_Y`,
      vertex: [Vector3.Zero(), new Vector3(0, 200, 0)],
      color: new Color3(0, 1, 0)
    },
    {
      name: `${_3DUI}_${_GIZMO}_Z`,
      vertex: [Vector3.Zero(), new Vector3(0, 0, 200)],
      color: new Color3(0, 0, 1)
    },
  ]

  dataset.forEach((item) => {
    const line = MeshBuilder.CreateLines(
      item.name,
      { points: item.vertex, updatable: false },
      scene
    )
    line.color = item.color
    line.parent = node
    line.isPickable = false
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

  const gridX = new TransformNode(`${_GRID}_X`, scene)
  const gridZ = new TransformNode(`${_GRID}_Z`, scene)

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
    const clone = axisX.clone(
      `${_3DUI}_${_GRID}_X_${index}`,
      gridX
    )
    clone.position = new Vector3(p - limit, 0, 0)
    clone.isPickable = false
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
    const clone = axisZ.clone(
      `${_3DUI}_${_GRID}_Z_${index}`,
      gridZ
    )
    clone.position = new Vector3(0, 0, p - limit)
    clone.isPickable = false
  })
  axisZ.dispose()
}

export { drawAxisLines, drawGrid }
