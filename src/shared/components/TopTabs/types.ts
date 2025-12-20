import type { ReactNode } from 'react';

export interface TopTabItem {
  value: string; // 탭 구분 값
  label: string; // 탭 텍스트
  icon?: ReactNode;
}

export interface TopTabsProps {
  items: readonly TopTabItem[]; // 탭 목록
  value: string; // 현재 활성 탭 값
  onChange: (next: string) => void;
  renderPanel: (active: string) => ReactNode; // 활성 탭 패널 렌더링
  className?: string;
  lazyMount?: boolean;
}
