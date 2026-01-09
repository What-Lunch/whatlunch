import { create } from 'zustand';

// 유저 정보 타입
type User = {
  email: string;
  nickname: string;
};
type AuthState = {
  user: User | null;
  isAuthLoading: boolean;
  setUser: (user: User) => void;
  clearUser: () => void;
  finishAuthCheck: () => void;
};

export const useAuthStore = create<AuthState>(set => ({
  user: null,
  isAuthLoading: true,
  setUser: user => set({ user, isAuthLoading: false }),
  clearUser: () => set({ user: null, isAuthLoading: false }),
  finishAuthCheck: () => set({ isAuthLoading: false }),
}));
