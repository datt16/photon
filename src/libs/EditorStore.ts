import { Vector3 } from "@babylonjs/core"
import { SceneMeshData } from "photon-babylon"
import create from "zustand"

type State = {
  // Editor State | エディタの状態情報
  currentPickedPoint?: Vector3
  currentPickedPointWindow: { x: number; y: number }
  pointerMeshUid?: number
  meshList: SceneMeshData
  pickMode: "gizmo" | "annotate"

  // Editor SceneData State | シーン情報
  sceneName: string
  cloudFileExists: boolean
  remoteSceneId?: string
  ownerId?: string
  cloudFilePath?: string
}

type Actions = {
  // エディタの状態の操作
  setPoint: (current: Vector3) => void
  setPointWindow: (current: { x: number; y: number }) => void
  setPointerMeshUid: (uid: number) => void
  setMeshList: (meshList: SceneMeshData) => void
  setPickMode: (pickMode: "gizmo" | "annotate") => void

  // その他、リセットなど
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
  meshList: {},
  pickMode: "gizmo",
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
  setMeshList: (meshList) => set({ meshList }),
  setPickMode: (pickMode) => set({ pickMode }),
}))
