export interface TopTabItem {
  value: string;
  label: string;
  icon?: React.ReactNode;
}

export interface TopTabsProps {
  items: readonly TopTabItem[];
  value?: string;
  onChange?: (value: string) => void;
  renderPanel: (value: string) => React.ReactNode;
  className?: string;
  lazyMount?: boolean;
}
