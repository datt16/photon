import {
  ArcRotateCamera,
  Camera,
  Color3,
  GizmoManager,
  HemisphericLight,
  MeshBuilder,
  Scene,
  Vector3,
} from "@babylonjs/core"
import { drawAxisLines, drawGrid } from "./Gizmo"

/**
 * @param scene: Babylonjs
 * @param gizmoManager: GizmoManager
 *
 * 初回準備時に実行
 */
const onEditorReady = (scene: Scene, gizmoManager: GizmoManager) => {
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

  // <======== Gizmoの設定

  gizmoManager.positionGizmoEnabled = true
  gizmoManager.rotationGizmoEnabled = true
  gizmoManager.scaleGizmoEnabled = true
  gizmoManager.usePointerToAttachGizmos = false

  if (gizmoManager.gizmos.positionGizmo?.scaleRatio)
    gizmoManager.gizmos.positionGizmo.scaleRatio = 1.2

  if (gizmoManager.gizmos.rotationGizmo?.scaleRatio)
    gizmoManager.gizmos.rotationGizmo.scaleRatio = 0.5

  if (gizmoManager.gizmos.scaleGizmo?.scaleRatio)
    gizmoManager.gizmos.scaleGizmo.scaleRatio = 0.7

  // <======== イベントリスナの設定

  // scene.onPointerDown = (evt: IPointerEvent) => {
  //   if (evt.inputIndex == PointerInput.MiddleClick) return

  //   const ray = scene.createPickingRay(
  //     scene.pointerX,
  //     scene.pointerY,
  //     Matrix.Identity(),
  //     camera,
  //     false
  //   )
  //   const hit = scene.pickWithRay(ray)

  //   if (gizmoManager) gizmoManager.attachToMesh(null)
  //   const picked = hit?.pickedMesh

  //   if (picked) {
  //     gizmoManager.attachToMesh(picked)
  //   }
  // }
}

/**
 * onEditorRendered
 * @param _scene: Babylonjs
 *
 * シーンのレンダー毎に実行
 */
// eslint-disable-next-line @typescript-eslint/no-unused-vars
const onEditorRendered = (_scene: Scene) => {
  // do nothing.
}

export { onEditorReady, onEditorRendered }
