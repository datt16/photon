import {
  Scene,
  GizmoManager,
  PointerEventTypes,
  Matrix,
  PointerInput,
  Observer,
  PointerInfo,
  CreateSphere,
  Vector3,
} from "@babylonjs/core"
import { GUI3DManager } from "@babylonjs/gui/3D"
import { Nullable } from "babylonjs"

type onAddAnnotate = (args: {
  pickedPointOnScene: Vector3
  pickedPointOnEditor: { x: number; y: number }
  pointObjectUid: number
}) => void

/**
 * TODO: SceneObservableの分割化
 * 今後、機能を追加する度にこのクラスに書いていくとなると、型定義の項目が色々増えてしまって非常に分かりにくい
 * このクラスはObservableの登録だけやって、Observableの中身は別のファイルで定義したものを使うようにしたい。
 */

export class SceneObservable {
  scene: Scene
  gizmoManager: GizmoManager
  manager: GUI3DManager
  PickGizmoPointerObserver: Nullable<Observer<PointerInfo>>
  AddAnnotatePointerObserver: Nullable<Observer<PointerInfo>>
  onAddAnnotate?: onAddAnnotate

  onPickMeshObserver = (eventData: PointerInfo) => {
    if (eventData.type == PointerEventTypes.POINTERDOWN) {
      if (eventData.event.inputIndex == PointerInput.MiddleClick) return

      const ray = this.scene.createPickingRay(
        this.scene.pointerX,
        this.scene.pointerY,
        Matrix.Identity(),
        this.scene.cameras[0],
        false
      )
      const hit = this.scene.pickWithRay(ray)

      if (this.gizmoManager) this.gizmoManager.attachToMesh(null)
      const picked = hit?.pickedMesh

      if (picked) {
        this.gizmoManager.attachToMesh(picked)
      }
    }
  }

  onAddAnnotateObserver = (eventData: PointerInfo) => {
    if (eventData.type == PointerEventTypes.POINTERDOWN) {
      if (eventData.event.inputIndex == PointerInput.MiddleClick) return

      const x = this.scene.pointerX
      const y = this.scene.pointerY

      const ray = this.scene.createPickingRay(
        x,
        y,
        Matrix.Identity(),
        this.scene.cameras[0],
        false
      )
      const hit = this.scene.pickWithRay(ray)

      if (hit?.pickedPoint) {
        const hitPoint = CreateSphere(
          "annotate",
          { segments: 8, diameter: 0.1 },
          this.scene
        )

        hitPoint.position.copyFromFloats(
          hit.pickedPoint.x,
          hit.pickedPoint.y,
          hit.pickedPoint.z
        )
        if (this.onAddAnnotate)
          this.onAddAnnotate({
            pickedPointOnScene: hitPoint.position,
            pickedPointOnEditor: { x, y },
            pointObjectUid: hitPoint.uniqueId,
          })
      }
    }
  }

  constructor(
    scene: Scene,
    gizmoManager: GizmoManager,
    onAddAnnotate?: onAddAnnotate
  ) {
    this.scene = scene
    this.gizmoManager = gizmoManager
    this.manager = new GUI3DManager(scene)
    this.onAddAnnotate = onAddAnnotate

    // Gizmo表示
    this.PickGizmoPointerObserver = scene.onPointerObservable.addOnce(
      this.onPickMeshObserver
    )
    this.AddAnnotatePointerObserver = scene.onPointerObservable.addOnce(
      this.onAddAnnotateObserver
    )
  }
}
