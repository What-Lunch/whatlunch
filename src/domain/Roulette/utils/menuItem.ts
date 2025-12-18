import { SituationFilter } from '../constants/filters';

// 메뉴에서 사용할 실제 타입을 명시적으로 정의
export type MenuFoodType = 'korean' | 'chinese' | 'japanese' | 'western' | 'snack';

export interface MenuItem {
  id: number;
  name: string;
  type: MenuFoodType;
  situations: SituationFilter[];
}
