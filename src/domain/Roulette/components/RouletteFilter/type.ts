import { ReactNode } from 'react';

import { MenuItem } from './../../utils/menuItem';

export interface RouletteFilterProps {
  onChange: (menus: MenuItem[]) => void;
  disabled?: boolean;
}

export interface FilterOption {
  value: string;
  label: string;
  icon: ReactNode;
  isActive: boolean;
}
