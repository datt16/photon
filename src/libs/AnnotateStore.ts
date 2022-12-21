import create from "zustand"

type AnnotateItemType = {
  title: string
  userName: string
  description: string
  targetPosition?: {
    x: number
    y: number
    z: number
  }
  uniqueId: number
  index: number
}

type AnnotateStoreType = {
  annotations: AnnotateItemType[]
  setWith: (newAnnotations: AnnotateItemType[]) => void
  appendItem: (newAnnotation: AnnotateItemType) => void
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
  setWith: (newAnnotations) =>
    set({
      annotations: newAnnotations,
    }),
  appendItem: (newAnnotation) =>
    set((state) => {
      return { annotations: [...state.annotations, newAnnotation] }
    }),
}))
