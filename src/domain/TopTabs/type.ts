export type TabType = 'roulette' | 'ladder' | 'map';

export interface TopTabsProps {
  tab: TabType;
  onChange: (value: TabType) => void;
}
