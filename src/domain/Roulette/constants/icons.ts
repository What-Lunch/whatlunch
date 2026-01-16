import { Category, Context } from '@/types/enum';

export const FOOD_ICONS: Record<Category, string> = {
  [Category.ALL]: '🍽️',
  [Category.BEST]: '⭐',
  [Category.CHINESE]: '🍜',
  [Category.WESTERN]: '🍔',
  [Category.JAPANESE]: '🍣',
  [Category.KOREAN]: '🍚',
  [Category.SNACK]: '🌭',
};

export const SITUATION_ICONS: Record<Context, string> = {
  [Context.LUNCH]: '🍱',
  [Context.SOLO]: '🙋‍♂️',
  [Context.GROUP]: '🍻',
  [Context.DIET]: '🥗',
  [Context.DATE]: '💖',
  [Context.STRESS]: '😡',
};
