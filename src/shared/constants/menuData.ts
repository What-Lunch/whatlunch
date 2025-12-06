import { MenuItem } from '../utils/recommend/menu';

export const MENU_DATA: MenuItem[] = [
  // 한식
  { name: '한식1', types: ['한식', '전체', '베스트'], situations: ['점심', '혼밥', '다이어트'] },
  { name: '한식2', types: ['한식', '전체', '베스트'], situations: ['점심', '데이트'] },
  { name: '한식3', types: ['한식', '전체'], situations: ['혼밥', '다이어트'] },
  { name: '한식4', types: ['한식', '전체'], situations: ['회식', '스트레스 받을 때'] },
  { name: '한식5', types: ['한식', '전체'], situations: ['점심', '스트레스 받을 때'] },
  { name: '한식6', types: ['한식', '전체'], situations: ['혼밥', '점심'] },
  { name: '한식7', types: ['한식', '전체'], situations: ['데이트', '점심'] },
  { name: '한식8', types: ['한식', '전체'], situations: ['혼밥', '다이어트'] },

  // 중식
  { name: '중식1', types: ['중식', '전체', '베스트'], situations: ['점심', '혼밥', '다이어트'] },
  { name: '중식2', types: ['중식', '전체', '베스트'], situations: ['스트레스 받을 때', '회식'] },
  { name: '중식3', types: ['중식', '전체'], situations: ['점심', '데이트'] },
  { name: '중식4', types: ['중식', '전체'], situations: ['혼밥', '스트레스 받을 때'] },
  { name: '중식5', types: ['중식', '전체'], situations: ['점심', '혼밥'] },
  { name: '중식6', types: ['중식', '전체'], situations: ['스트레스 받을 때', '회식'] },
  { name: '중식7', types: ['중식', '전체'], situations: ['데이트', '회식'] },
  { name: '중식8', types: ['중식', '전체'], situations: ['점심', '혼밥'] },

  // 일식
  { name: '일식1', types: ['일식', '전체', '베스트'], situations: ['데이트', '점심', '다이어트'] },
  { name: '일식2', types: ['일식', '전체', '베스트'], situations: ['혼밥', '데이트'] },
  { name: '일식3', types: ['일식', '전체'], situations: ['스트레스 받을 때', '점심'] },
  { name: '일식4', types: ['일식', '전체'], situations: ['혼밥', '점심', '다이어트'] },
  { name: '일식5', types: ['일식', '전체'], situations: ['데이트', '점심', '회식'] },
  { name: '일식6', types: ['일식', '전체'], situations: ['혼밥', '스트레스 받을 때'] },
  { name: '일식7', types: ['일식', '전체'], situations: ['점심', '혼밥'] },
  { name: '일식8', types: ['일식', '전체'], situations: ['데이트', '혼밥'] },

  // 양식
  { name: '양식1', types: ['양식', '전체', '베스트'], situations: ['데이트', '점심'] },
  { name: '양식2', types: ['양식', '전체'], situations: ['혼밥', '점심'] },
  { name: '양식3', types: ['양식', '전체'], situations: ['스트레스 받을 때', '회식'] },
  { name: '양식4', types: ['양식', '전체'], situations: ['데이트', '점심'] },
  { name: '양식5', types: ['양식', '전체'], situations: ['혼밥', '다이어트'] },
  { name: '양식6', types: ['양식', '전체'], situations: ['회식', '점심'] },
  { name: '양식7', types: ['양식', '전체'], situations: ['스트레스 받을 때', '데이트'] },
  { name: '양식8', types: ['양식', '전체'], situations: ['혼밥', '점심'] },

  // 분식
  { name: '분식1', types: ['분식', '전체', '베스트'], situations: ['스트레스 받을 때', '점심'] },
  { name: '분식2', types: ['분식', '전체'], situations: ['혼밥', '다이어트'] },
  { name: '분식3', types: ['분식', '전체'], situations: ['점심', '스트레스 받을 때'] },
  { name: '분식4', types: ['분식', '전체'], situations: ['혼밥', '점심'] },
  { name: '분식5', types: ['분식', '전체'], situations: ['회식', '스트레스 받을 때'] },
  { name: '분식6', types: ['분식', '전체'], situations: ['혼밥', '점심'] },
  { name: '분식7', types: ['분식', '전체'], situations: ['데이트', '점심'] },
  { name: '분식8', types: ['분식', '전체'], situations: ['스트레스 받을 때', '혼밥'] },
];
