import {
  ArcRotateCamera,
  Color3,
  Engine,
  GizmoManager,
  HemisphericLight,
  KeyboardEventTypes,
  MeshBuilder,
  Scene,
  Vector3,
} from "@babylonjs/core"
import { drawAxisLines, drawGrid } from "./Gizmo"

let camera: ArcRotateCamera
let targetPosition: Vector3, currentPosition: Vector3
let cameraAnimate = false

/**
 * @param scene: Babylonjs
 * @param gizmoManager: GizmoManager
 *
 * 初回準備時に実行
 */
const onEditorReady = (scene: Scene, gizmoManager: GizmoManager) => {
  camera = new ArcRotateCamera(
    "camera",
    -Math.PI / 2,
    Math.PI / 2.5,
    10,
    new Vector3(0, 0, 0),
    scene
  )
  camera.minZ = 0.001
  camera.attachControl(true)

  targetPosition = camera.position
  currentPosition = camera.position

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

  scene.onKeyboardObservable.add((kbInfo) => {
    switch (kbInfo.type) {
      case KeyboardEventTypes.KEYDOWN:
        switch (kbInfo.event.key) {
          case "1":
            cameraAnimate = true
            targetPosition = new Vector3(-5, 0, 0)
            break

          case "3":
            cameraAnimate = true
            targetPosition = new Vector3(5, 0, 0)
            break
          case "7":
            cameraAnimate = true
            targetPosition = new Vector3(0, 5, 0)
            break
        }
        break
    }
  })
}

/**
 * onEditorRendered
 * @param _scene: Babylonjs
 *
 * シーンのレンダー毎に実行
 */
// eslint-disable-next-line @typescript-eslint/no-unused-vars
const onEditorRendered = (_scene: Scene, engine: Engine) => {
  const deltaTime = engine.getDeltaTime() / 1000

  // targetPositionが変更されたときにアニメーションして遷移
  if (cameraAnimate) {
    if (Vector3.DistanceSquared(currentPosition, targetPosition) <= 0.0001) {
      currentPosition = targetPosition
      camera.position = currentPosition
      cameraAnimate = false
    } else {
      currentPosition = Vector3.Lerp(
        currentPosition,
        targetPosition,
        deltaTime * 4.0
      )
      camera.position = currentPosition
    }
  }
}

export { onEditorReady, onEditorRendered }
