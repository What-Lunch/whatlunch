import { Category, Context } from '@/types/enum';

export interface MenuItem {
  id: number;
  name: string;
  type: Category;
  situations: Context[];
}
