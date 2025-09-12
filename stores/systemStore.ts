import { create } from "zustand";

type LocalState = {
  expanded: boolean;
  toggle: () => void;
};

export const useSystemStore = create<LocalState>((set: any) => ({
  expanded: true,
  toggle: () => set((state: any) => ({ expanded: !state.expanded })),
}));