import { MenuItem } from '../utils/menuItem';

// 완전 타입 안전한 MENU_DATA
export const MENU_DATA: MenuItem[] = [
  { id: 1, name: '한식1', type: 'korean', situations: ['lunch', 'solo', 'diet'] },
  { id: 2, name: '한식2', type: 'korean', situations: ['lunch', 'date'] },
  { id: 3, name: '한식3', type: 'korean', situations: ['solo', 'diet'] },
  { id: 4, name: '한식4', type: 'korean', situations: ['party', 'stress'] },
  { id: 5, name: '한식5', type: 'korean', situations: ['lunch', 'stress'] },
  { id: 6, name: '한식6', type: 'korean', situations: ['solo', 'lunch'] },
  { id: 7, name: '한식7', type: 'korean', situations: ['date', 'lunch'] },
  { id: 8, name: '한식8', type: 'korean', situations: ['solo', 'diet'] },

  { id: 9, name: '중식1', type: 'chinese', situations: ['lunch', 'solo', 'diet'] },
  { id: 10, name: '중식2', type: 'chinese', situations: ['stress', 'party'] },
  { id: 11, name: '중식3', type: 'chinese', situations: ['lunch', 'date'] },
  { id: 12, name: '중식4', type: 'chinese', situations: ['solo', 'stress'] },
  { id: 13, name: '중식5', type: 'chinese', situations: ['lunch', 'solo'] },
  { id: 14, name: '중식6', type: 'chinese', situations: ['stress', 'party'] },
  { id: 15, name: '중식7', type: 'chinese', situations: ['date', 'party'] },
  { id: 16, name: '중식8', type: 'chinese', situations: ['lunch', 'solo'] },

  { id: 17, name: '일식1', type: 'japanese', situations: ['date', 'lunch', 'diet'] },
  { id: 18, name: '일식2', type: 'japanese', situations: ['solo', 'date'] },
  { id: 19, name: '일식3', type: 'japanese', situations: ['stress', 'lunch'] },
  { id: 20, name: '일식4', type: 'japanese', situations: ['solo', 'lunch', 'diet'] },
  { id: 21, name: '일식5', type: 'japanese', situations: ['date', 'lunch', 'party'] },
  { id: 22, name: '일식6', type: 'japanese', situations: ['solo', 'stress'] },
  { id: 23, name: '일식7', type: 'japanese', situations: ['lunch', 'solo'] },
  { id: 24, name: '일식8', type: 'japanese', situations: ['date', 'solo'] },

  { id: 25, name: '양식1', type: 'western', situations: ['date', 'lunch'] },
  { id: 26, name: '양식2', type: 'western', situations: ['solo', 'lunch'] },
  { id: 27, name: '양식3', type: 'western', situations: ['stress', 'party'] },
  { id: 28, name: '양식4', type: 'western', situations: ['date', 'lunch'] },
  { id: 29, name: '양식5', type: 'western', situations: ['solo', 'diet'] },
  { id: 30, name: '양식6', type: 'western', situations: ['party', 'lunch'] },
  { id: 31, name: '양식7', type: 'western', situations: ['stress', 'date'] },
  { id: 32, name: '양식8', type: 'western', situations: ['solo', 'lunch'] },

  { id: 33, name: '분식1', type: 'snack', situations: ['stress', 'lunch'] },
  { id: 34, name: '분식2', type: 'snack', situations: ['solo', 'diet'] },
  { id: 35, name: '분식3', type: 'snack', situations: ['lunch', 'stress'] },
  { id: 36, name: '분식4', type: 'snack', situations: ['solo', 'lunch'] },
  { id: 37, name: '분식5', type: 'snack', situations: ['party', 'stress'] },
  { id: 38, name: '분식6', type: 'snack', situations: ['solo', 'lunch'] },
  { id: 39, name: '분식7', type: 'snack', situations: ['date', 'lunch'] },
  { id: 40, name: '분식8', type: 'snack', situations: ['stress', 'solo'] },
];
