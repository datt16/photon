import {
  Scene,
  GizmoManager,
  PointerEventTypes,
  Matrix,
  PointerInput,
  Observer,
  PointerInfo,
} from "@babylonjs/core"
import { Nullable } from "babylonjs"

export class SceneObservable {
  scene: Scene
  gizmoManager: GizmoManager
  PickGizmoPointerObserver: Nullable<Observer<PointerInfo>>

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

  constructor(scene: Scene, gizmoManager: GizmoManager) {
    this.scene = scene
    this.gizmoManager = gizmoManager

    // Gizmo表示
    this.PickGizmoPointerObserver = scene.onPointerObservable.addOnce(
      this.onPickMeshObserver
    )
  }
}
