import create from "zustand"

type State = {
  uid?: string
  isConfirm: boolean
  avatarImageUrl: string | null
  userName: string | null
}

type Actions = {
  setUid: (id: string) => void
  setConfirm: (c: boolean) => void
  handleLogin: (args: {
    uid: string
    avatarImageUrl: string
    userName: string
  }) => void
  handleLogout: () => void
}

const initialState: State = {
  uid: undefined,
  isConfirm: false,
  avatarImageUrl: null,
  userName: null,
}

export const useUserStore = create<State & Actions>((set) => ({
  ...initialState,
  setUid: (id) => set({ uid: id }),
  setConfirm: (c) => set({ isConfirm: c }),
  handleLogin: (args) => {
    set({
      uid: args.uid,
      avatarImageUrl: args.avatarImageUrl,
      userName: args.userName,
    })
  },
  handleLogout: () => set(initialState),
}))
