import { Vector3 } from "@babylonjs/core"
import create from "zustand"

type EditorStateType = {
  currentPickedPoint?: Vector3
  setPoint: (current: Vector3) => void
}

export const useEditorStore = create<EditorStateType>((set) => ({
  currentPickedPoint: undefined,
  setPoint: (current) => set({ currentPickedPoint: current }),
}))
