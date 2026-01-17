import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface RouletteResultState {
  results: Menu.GetMenuRes[];
  addResult: (result: Menu.GetMenuRes[]) => void;
  clearResults: () => void;
}

export const useRouletteResultStore = create<RouletteResultState>()(
  persist(
    set => ({
      results: [],
      addResult: (result: Menu.GetMenuRes[]) =>
        set(state => ({ results: [...result, ...state.results] })),
      clearResults: () => set({ results: [] }),
    }),
    {
      name: 'roulette-result-storage',
    }
  )
);
