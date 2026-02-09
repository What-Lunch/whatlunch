import { create } from 'zustand';

// 최대 선택 가능한 음식 도트 수
const MAX_SELECTABLE = 9;

type FoodDotState = {
  selectedDotIds: string[];
  setSelectedDotIds: (ids: string[]) => void;
  toggleDotId: (id: string) => { blocked: boolean };
};

export const useFoodDotStore = create<FoodDotState>(set => ({
  selectedDotIds: [],

  setSelectedDotIds: ids => set(() => ({ selectedDotIds: ids })),

  toggleDotId: id => {
    let blocked = false;

    set(state => {
      const exists = state.selectedDotIds.includes(id);

      if (!exists && state.selectedDotIds.length >= MAX_SELECTABLE) {
        blocked = true;
        return state;
      }

      return {
        selectedDotIds: exists
          ? state.selectedDotIds.filter(dotId => dotId !== id)
          : [...state.selectedDotIds, id],
      };
    });

    return { blocked };
  },
}));
