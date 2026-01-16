import { Category, Context } from '@/types/enum';

export interface MenuItem {
  id: string;
  name: string;
  category: Category;
  contexts: Context[];
}
