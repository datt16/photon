import create from "zustand"

type State = {
  uid?: string
  isConfirm: boolean
}

type Actions = {
  setUid: (id: string) => void
  setConfirm: (c: boolean) => void
  handleLogin: (uid: string) => void
  handleLogout: () => void
}

const initialState: State = {
  uid: undefined,
  isConfirm: false,
}

export const useUserStore = create<State & Actions>((set) => ({
  ...initialState,
  setUid: (id) => set({ uid: id }),
  setConfirm: (c) => set({ isConfirm: c }),
  handleLogin: (uid) => {
    set({
      uid,
    })
  },
  handleLogout: () => set(initialState),
}))
