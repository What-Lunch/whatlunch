import { Menu } from '@/types/api';

export const FOOD_ICONS: Record<Menu.Category, string> = {
  [Menu.Category.ALL]: '🍽️',
  [Menu.Category.BEST]: '⭐',
  [Menu.Category.CHINESE]: '🍜',
  [Menu.Category.WESTERN]: '🍔',
  [Menu.Category.JAPANESE]: '🍣',
  [Menu.Category.KOREAN]: '🍚',
  [Menu.Category.SNACK]: '🌭',
};

export const SITUATION_ICONS: Record<Menu.Context, string> = {
  [Menu.Context.LUNCH]: '🍱',
  [Menu.Context.SOLO]: '🙋‍♂️',
  [Menu.Context.GROUP]: '🍻',
  [Menu.Context.DIET]: '🥗',
  [Menu.Context.DATE]: '💖',
  [Menu.Context.STRESS]: '😡',
};
