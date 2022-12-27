import { Vector3 } from "@babylonjs/core"
import create from "zustand"

type EditorStateType = {
  currentPickedPoint?: Vector3
  currentPickedPointWindow: { x: number; y: number }
  setPoint: (current: Vector3) => void
  setPointWindow: (current: { x: number; y: number }) => void
}

export const useEditorStore = create<EditorStateType>((set) => ({
  currentPickedPoint: undefined,
  currentPickedPointWindow: { x: 0, y: 0 },
  setPoint: (current) => set({ currentPickedPoint: current }),
  setPointWindow: (current) => set({ currentPickedPointWindow: current }),
}))
