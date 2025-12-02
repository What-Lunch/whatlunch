export interface MapPanelProps {
  keyword: string;
  setKeyword: (v: string) => void;
  onKeywordSearch: () => void;
  onCategoryClick: (code: string) => void;
  onReset: () => void;
}

export type CategoryCode = 'FD6' | 'CE7' | 'CS2' | 'MT1' | 'AD5';

export interface Category {
  code: CategoryCode;
  label: string;
}

export const CATEGORIES: Category[] = [
  { code: 'FD6', label: '음식점' },
  { code: 'CE7', label: '카페' },
  { code: 'CS2', label: '편의점' },
  { code: 'MT1', label: '마트' },
];
