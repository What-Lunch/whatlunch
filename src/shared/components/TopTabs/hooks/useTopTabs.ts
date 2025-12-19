import { useCallback, useEffect, useMemo, useRef, useState } from 'react';

import type { KeyboardEvent, MutableRefObject } from 'react';

import type { TopTabItem } from '../types';

type UseTopTabsArgs = {
  items: readonly TopTabItem[];
  value: string;
  onChange: (next: string) => void; // 탭 변경 시 호출되는 콜백
};

export type TopTabsController = {
  items: readonly TopTabItem[];
  activeValue: string;
  activeIndex: number;
  focusIndex: number; // 키보드 이동 기준이 되는 포커스 인덱스

  setActive: (next: string) => void;

  registerButtonRef: (index: number, element: HTMLButtonElement | null) => void;
  onKeyDownTab: (event: KeyboardEvent<HTMLButtonElement>, index: number) => void; // 탭 키보드 네비게이션 핸들러

  buttonRefs: MutableRefObject<Array<HTMLButtonElement | null>>; // 탭 버튼 DOM ref 배열
};

export function useTopTabs({ items, value, onChange }: UseTopTabsArgs): TopTabsController {
  const buttonRefs = useRef<Array<HTMLButtonElement | null>>([]);

  const activeValue = useMemo(() => {
    if (items.length === 0) return value;
    return items.some(item => item.value === value) ? value : items[0].value;
  }, [items, value]);

  const activeIndex = useMemo(() => {
    const foundIndex = items.findIndex(item => item.value === activeValue);
    return foundIndex >= 0 ? foundIndex : 0;
  }, [items, activeValue]);

  const [focusIndex, setFocusIndex] = useState<number>(activeIndex);

  useEffect(() => {
    setFocusIndex(activeIndex);
  }, [activeIndex]);

  // items 길이가 변할 때 focusIndex 방어
  useEffect(() => {
    if (items.length === 0) return;
    setFocusIndex(prev => Math.min(prev, items.length - 1));
  }, [items.length]);

  const registerButtonRef = useCallback((index: number, element: HTMLButtonElement | null) => {
    buttonRefs.current[index] = element;
  }, []);

  const focusTabByIndex = useCallback(
    (targetIndex: number) => {
      const itemCount = items.length;
      if (itemCount === 0) return;

      const normalizedIndex = (targetIndex + itemCount) % itemCount;
      setFocusIndex(normalizedIndex);
      buttonRefs.current[normalizedIndex]?.focus();
    },
    [items]
  );

  const onKeyDownTab = useCallback(
    (event: KeyboardEvent<HTMLButtonElement>, index: number) => {
      const itemCount = items.length;
      if (itemCount === 0) return;

      if (event.key === 'ArrowLeft') {
        event.preventDefault();
        focusTabByIndex(index - 1);
        return;
      }

      if (event.key === 'ArrowRight') {
        event.preventDefault();
        focusTabByIndex(index + 1);
        return;
      }

      if (event.key === 'Home') {
        event.preventDefault();
        focusTabByIndex(0);
        return;
      }

      if (event.key === 'End') {
        event.preventDefault();
        focusTabByIndex(itemCount - 1);
        return;
      }

      if (event.key === 'Enter' || event.key === ' ') {
        event.preventDefault();
        const next = items[focusIndex]?.value; // 포커스 기준 확정
        if (next) onChange(next);
      }
    },
    [focusTabByIndex, focusIndex, items, onChange]
  );

  return {
    items,
    activeValue,
    activeIndex,
    focusIndex,
    setActive: onChange,
    registerButtonRef,
    onKeyDownTab,
    buttonRefs,
  };
}
