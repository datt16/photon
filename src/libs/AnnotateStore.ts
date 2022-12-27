import { Vector3 } from "@babylonjs/core"
import create from "zustand"

interface AnnotateItemType {
  title: string
  userName: string
  description: string
  targetPosition?: Vector3
  uniqueId: number
  index: number
}

interface EditingAnnotateItemType extends AnnotateItemType {
  isReady: boolean
}

type AnnotateStoreType = {
  annotations: AnnotateItemType[]
  editingAnnotation?: EditingAnnotateItemType

  setAll: (newAnnotations: AnnotateItemType[]) => void
  appendItem: (newAnnotation: AnnotateItemType) => void

  editNewAnnotation: (item: AnnotateItemType) => void
  ready: () => void
  submit: () => void
}

export const useAnnotateStore = create<AnnotateStoreType>((set) => ({
  annotations: [
    {
      title: "注釈１",
      userName: "datt16",
      description:
        "これはただの立方体です。タップ時に何かリアクションするように設定予定。",
      uniqueId: 111,
      index: 1,
    },
  ],
  setAll: (newAnnotations) =>
    set({
      annotations: newAnnotations,
    }),
  appendItem: (newAnnotation) =>
    set((state) => {
      return { annotations: [...state.annotations, newAnnotation] }
    }),
  editNewAnnotation: (item) => {
    set({ editingAnnotation: { ...item, isReady: false } })
  },
  ready: () =>
    set((state) => {
      return {
        editingAnnotation: {
          ...(state.editingAnnotation as AnnotateItemType),
          isReady: true,
        },
      }
    }),
  submit: () => {
    set((state) => {
      return {
        editNewAnnotation: undefined,
        annotations: [
          ...state.annotations,
          state.editingAnnotation as AnnotateItemType,
        ],
      }
    })
  },
}))
