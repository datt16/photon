import {Color3, MeshBuilder, Scene, Vector3} from "babylonjs";
import "../util"
import {range} from "../util";

const drawAxisLines = (scene: Scene) => {
    const xLinePoints = [Vector3.Zero(), new Vector3(200, 0, 0)]
    const yLinePoints = [Vector3.Zero(), new Vector3(0, 200, 0)]
    const zLinePoints = [Vector3.Zero(), new Vector3(0, 0, 200)]
    const axisX = MeshBuilder.CreateLines("AxisX", {points: xLinePoints, updatable: false}, scene)
    const axisY = MeshBuilder.CreateLines("AxisY", {points: yLinePoints, updatable: false}, scene)
    const axisZ = MeshBuilder.CreateLines("AxisZ", {points: zLinePoints, updatable: false}, scene)
    axisX.color = new Color3(1, 0, 0)
    axisY.color = new Color3(0, 1, 0)
    axisZ.color = new Color3(0, 0, 1)
}

const drawGrid = (scene: Scene, limit: number = 100, distance: number = 1) => {
    const linePointsBase = range(0, limit * 2, distance)
    const gridColor = new Color3(0.5, 0.5, 0.5)

    const axisX = MeshBuilder.CreateLines("Grid-X", {points: [new Vector3(0, 0, -1 * limit), new Vector3(0, 0, limit)], updatable: false}, scene)
    axisX.position = new Vector3(-100, 0, 0)
    axisX.color = gridColor
    linePointsBase.forEach((p, index) => {
        const clone = axisX.clone(`Grid-X-${index}`)
        clone.position = new Vector3(p - limit, 0, 0)
    })
    axisX.dispose()

    const axisZ = MeshBuilder.CreateLines("Grid-Z", {points: [new Vector3(-1 * limit, 0, 0), new Vector3(limit, 0, 0)], updatable: false}, scene)
    axisZ.position = new Vector3(0, 0, -1 * limit)
    axisZ.color = gridColor
    linePointsBase.forEach((p, index) => {
        const clone = axisZ.clone(`Grid-Z-${index}`)
        clone.position = new Vector3(0, 0, p - limit)
    })
    axisZ.dispose()
}

export {drawAxisLines, drawGrid}