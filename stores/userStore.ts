import { create } from "zustand";

type LocalState = {
  token: string | null;
  setToken: any;
};

export const useUserStore = create<LocalState>((set: any) => ({
  token: null,
  setToken: () => set((state: any) => ({ token: state.token })),
}));