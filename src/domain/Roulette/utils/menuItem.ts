import { Menu } from '@/types/api';

export interface MenuItem {
  id: number;
  name: string;
  type: Menu.Category;
  situations: Menu.Context[];
}
