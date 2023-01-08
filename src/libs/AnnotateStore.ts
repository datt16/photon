import { Vector3 } from "@babylonjs/core"
import create from "zustand"

export interface AnnotateItemType {
  title: string
  userName: string
  description: string
  targetPosition?: Vector3
  uniqueId: number
  index: number
}

type AnnotateStoreType = {
  annotations: AnnotateItemType[]
  editingData: AnnotateItemType
  isEditing: boolean

  setAll: (newAnnotations: AnnotateItemType[]) => void
  appendItem: (newAnnotation: AnnotateItemType) => void

  editNewAnnotation: (item: AnnotateItemType) => void
  submit: () => void

  setIsEditing: (next: boolean) => void
  clearEditing: () => void
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
  editingData: {
    title: "untitled",
    userName: "",
    description: "",
    uniqueId: -1,
    index: -1,
  },
  isEditing: false,
  setAll: (newAnnotations) =>
    set({
      annotations: newAnnotations,
    }),
  appendItem: (newAnnotation) =>
    set((state) => {
      return { annotations: [...state.annotations, newAnnotation] }
    }),
  editNewAnnotation: (item) => {
    set({ editingData: item })
  },
  submit: () => {
    set((state) => {
      return {
        annotations: [
          ...state.annotations,
          state.editingData as AnnotateItemType,
        ],
      }
    })
  },
  setIsEditing: (next) => {
    set({ isEditing: next })
  },
  clearEditing: () => {
    set({
      editingData: {
        title: "untitled",
        userName: "",
        description: "",
        uniqueId: -1,
        index: -1,
      },
    })
  },
}))
