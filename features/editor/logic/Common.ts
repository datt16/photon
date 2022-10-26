import { ArcRotateCamera, Color3, HemisphericLight, MeshBuilder, Scene, Vector3 } from "babylonjs"
import { drawAxisLines, drawGrid } from "./Gizmo"

/**
 * @param scene: Babylonjs
 *
 * 初回準備時に実行
 */
const onEditorReady = (scene: Scene) => {

    // カメラ
    new ArcRotateCamera(
        "camera",
        -Math.PI / 2,
        Math.PI / 2.5,
        10,
        new Vector3(0, 0, 0),
        scene
    ).attachControl(true)

    // 環境光
    const light0 = new HemisphericLight("Hemi0", new Vector3(0, 1, 0), scene)
    light0.diffuse = new Color3(1, 0, 0) // 空用
    light0.specular = new Color3(0, 1, 0) // 地面用
    light0.groundColor = new Color3(0, 0, 0) // 鏡面反射用

    MeshBuilder
        .CreateBox(
            "box1",
            {
                size: 1
            },
            scene)
    drawGrid(scene, 5, 1)
    drawAxisLines(scene)
}

/**
 * onEditorRendered
 * @param scene: Babylonjs
 *
 * シーンのレンダー毎に実行
 */
const onEditorRendered = (scene: Scene) => {
}

export { onEditorReady, onEditorRendered }
