export interface RouletteFilterProps {
  onChange: (menus: string[]) => void;
  disabled?: boolean;
}

export interface FilterOption<T> {
  value: T;
  label: string;
  icon: React.ReactNode;
  isActive: boolean;
}
