import {
  Scene,
  GizmoManager,
  PointerEventTypes,
  Matrix,
  PointerInput,
  Observer,
  PointerInfo,
  Vector3,
  CreateSphere,
} from "@babylonjs/core"
import { Button3D, GUI3DManager } from "@babylonjs/gui/3D"
import { Nullable } from "babylonjs"

export class SceneObservable {
  scene: Scene
  gizmoManager: GizmoManager
  manager: GUI3DManager
  PickGizmoPointerObserver: Nullable<Observer<PointerInfo>>
  AddAnnotatePointerObserver: Nullable<Observer<PointerInfo>>

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

      const ray = this.scene.createPickingRay(
        this.scene.pointerX,
        this.scene.pointerY,
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
      }
    }
  }

  constructor(scene: Scene, gizmoManager: GizmoManager) {
    this.scene = scene
    this.gizmoManager = gizmoManager
    this.manager = new GUI3DManager(scene)

    // Gizmo表示
    this.PickGizmoPointerObserver = scene.onPointerObservable.addOnce(
      this.onPickMeshObserver
    )
    this.AddAnnotatePointerObserver = scene.onPointerObservable.addOnce(
      this.onAddAnnotateObserver
    )
  }
}
