import { create } from 'zustand';

interface RouletteResultState {
  results: Menu.GetMenuRes[];
  addResult: (result: Menu.GetMenuRes[]) => void;
  clearResults: () => void;
}

export const useRouletteResultStore = create<RouletteResultState>(set => ({
  results: [],
  addResult: (result: Menu.GetMenuRes[]) =>
    set(state => ({ results: [...result, ...state.results] })),
  clearResults: () => set({ results: [] }),
}));
