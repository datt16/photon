import { Vector3 } from "@babylonjs/core"
import create from "zustand"

type State = {
  currentPickedPoint?: Vector3
  currentPickedPointWindow: { x: number; y: number }
  pointerMeshUid?: number
  sceneName: string
  cloudFileExists: boolean
  remoteSceneId?: string
  ownerId?: string
  cloudFilePath?: string
}

type Actions = {
  // use on 3d scene
  setPoint: (current: Vector3) => void
  setPointWindow: (current: { x: number; y: number }) => void
  setPointerMeshUid: (uid: number) => void

  // other
  reset: () => void
  setRemoteData: (args: {
    sceneName: string
    remoteSceneId: string
    ownerId: string
    cloudFilePath: string
  }) => void
}

const initialState: State = {
  currentPickedPointWindow: {
    x: 0,
    y: 0,
  },
  sceneName: "untitled",
  cloudFileExists: false,
}

export const useEditorStore = create<State & Actions>((set) => ({
  ...initialState,
  setPoint: (current) => set({ currentPickedPoint: current }),
  setPointWindow: (current) => set({ currentPickedPointWindow: current }),
  setPointerMeshUid: (uid) => set({ pointerMeshUid: uid }),
  reset: () => set(initialState),
  setRemoteData: (args) => {
    set({ ...args, cloudFileExists: true })
  },
}))
