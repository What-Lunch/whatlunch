import { create } from 'zustand';

interface RouletteResultState {
  // 룸별 결과 저장 (roomId -> 결과 배열)
  resultsByRoom: Map<string, Menu.GetMenuRes[]>;

  // 현재 방의 결과
  results: Menu.GetMenuRes[];

  // 현재 룸 ID
  currentRoomId: string | null;

  // 현재 룸의 결과 조회
  getResults: (roomId: string) => Menu.GetMenuRes[];

  // 현재 룸에 결과 추가
  addResult: (roomId: string, result: Menu.GetMenuRes[]) => void;

  // 현재 룸 설정
  setCurrentRoom: (roomId: string) => void;

  // 특정 룸의 결과 설정 (서버로부터 받은 결과 동기화)
  setRoomResults: (roomId: string, results: Menu.GetMenuRes[]) => void;

  // 특정 룸의 결과 초기화
  clearRoomResults: (roomId: string) => void;

  // 모든 룸의 결과 초기화
  clearAllResults: () => void;
}

export const useRouletteResultStore = create<RouletteResultState>((set, get) => ({
  resultsByRoom: new Map(),
  results: [],
  currentRoomId: null,

  getResults: (roomId: string) => {
    const state = get();
    return state.resultsByRoom.get(roomId) || [];
  },

  addResult: (roomId: string, result: Menu.GetMenuRes[]) => {
    set(state => {
      const newMap = new Map(state.resultsByRoom);
      const currentResults = newMap.get(roomId) || [];
      newMap.set(roomId, [...result, ...currentResults]);

      return {
        resultsByRoom: newMap,
        results: state.currentRoomId === roomId ? newMap.get(roomId) || [] : state.results,
      };
    });
  },

  setCurrentRoom: (roomId: string) => {
    set(state => ({
      currentRoomId: roomId,
      results: state.resultsByRoom.get(roomId) || [],
    }));
  },

  setRoomResults: (roomId: string, results: Menu.GetMenuRes[]) => {
    set(state => {
      const newMap = new Map(state.resultsByRoom);
      newMap.set(roomId, results);

      return {
        resultsByRoom: newMap,
        results: state.currentRoomId === roomId ? results : state.results,
      };
    });
  },

  clearRoomResults: (roomId: string) => {
    set(state => {
      const newMap = new Map(state.resultsByRoom);
      newMap.delete(roomId);

      return {
        resultsByRoom: newMap,
        results: state.currentRoomId === roomId ? [] : state.results,
      };
    });
  },

  clearAllResults: () => {
    set({
      resultsByRoom: new Map(),
      results: [],
      currentRoomId: null,
    });
  },
}));
