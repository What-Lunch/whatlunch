import { create } from 'zustand';

type FoodDotState = {
  selectedDotIds: string[];
  setSelectedDotIds: (ids: string[]) => void;
  addDotId: (id: string) => void;
  removeDotId: (id: string) => void;
};

export const useFoodDotStore = create<FoodDotState>((set, get) => ({
  selectedDotIds: [],

  setSelectedDotIds: (ids: string[]) => set({ selectedDotIds: ids }),

  addDotId: (id: string) => {
    const current = get().selectedDotIds;
    if (current.includes(id)) return;
    set({ selectedDotIds: [...current, id] });
  },

  removeDotId: (id: string) => {
    set({ selectedDotIds: get().selectedDotIds.filter(dotId => dotId !== id) });
  },
}));
