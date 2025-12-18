import { MenuItem } from '../../utils/menuItem';

export interface RouletteFilterProps {
  onChange: (menus: MenuItem[]) => void;
  disabled?: boolean;
}
