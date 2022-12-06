import {
  ArcRotateCamera,
  Camera,
  Color3,
  HemisphericLight,
  Matrix,
  MeshBuilder,
  Scene,
  Vector3,
} from "@babylonjs/core"
import { drawAxisLines, drawGrid } from "./Gizmo"

/**
 * @param scene: Babylonjs
 *
 * 初回準備時に実行
 */
const onEditorReady = (scene: Scene) => {
  // カメラ
  const camera: Camera = new ArcRotateCamera(
    "camera",
    -Math.PI / 2,
    Math.PI / 2.5,
    10,
    new Vector3(0, 0, 0),
    scene
  )

  camera.attachControl(true)

  // 環境光
  const light0 = new HemisphericLight("Hemi0", new Vector3(0, 1, 0), scene)
  light0.diffuse = new Color3(1, 1, 1) // 空用
  light0.specular = new Color3(0, 0, 0) // 地面用
  light0.groundColor = new Color3(0, 0, 0) // 鏡面反射用

  MeshBuilder.CreateBox(
    "box1",
    {
      size: 1,
    },
    scene
  )
  drawGrid(scene, 5, 1)
  drawAxisLines(scene)

  scene.onPointerDown = () => {
    const ray = scene.createPickingRay(scene.pointerX, scene.pointerY, Matrix.Identity(), camera, false)
    const hit = scene.pickWithRay(ray)

    if (hit?.pickedMesh) {
      console.log("mesh picked")
    }
  }

}

/**
 * onEditorRendered
 * @param scene: Babylonjs
 *
 * シーンのレンダー毎に実行
 */
const onEditorRendered = (scene: Scene) => { }

export { onEditorReady, onEditorRendered }
