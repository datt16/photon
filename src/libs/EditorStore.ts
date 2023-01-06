import { Vector3 } from "@babylonjs/core"
import create from "zustand"

type EditorStateType = {
  currentPickedPoint?: Vector3
  setPoint: (current: Vector3) => void

  currentPickedPointWindow: { x: number; y: number }
  setPointWindow: (current: { x: number; y: number }) => void

  pointerMeshUid?: number
  setPointerMeshUid: (uid: number) => void
}

export const useEditorStore = create<EditorStateType>((set) => ({
  pointerMeshUid: undefined,
  currentPickedPoint: undefined,
  currentPickedPointWindow: { x: 0, y: 0 },
  setPoint: (current) => set({ currentPickedPoint: current }),
  setPointWindow: (current) => set({ currentPickedPointWindow: current }),
  setPointerMeshUid: (uid) => set({ pointerMeshUid: uid }),
}))
