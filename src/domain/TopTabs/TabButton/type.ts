import { TabType } from '../type';

export interface TabButtonProps {
  value: TabType;
  tab: TabType; // 현재 활성화된 탭 값
  onChange: (value: TabType) => void;
  icon?: React.ReactNode;
  children?: React.ReactNode;
}
