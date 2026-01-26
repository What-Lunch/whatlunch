import { useCallback, useEffect, useRef, useState } from 'react';
import type { TopTabItem } from '../types';

interface UseTopTabsProps {
  items: readonly TopTabItem[];
  value?: string;
  onChange?: (value: string) => void;
}

export function useTopTabs({ items, value, onChange }: UseTopTabsProps) {
  const [activeValue, setActiveValue] = useState<string>(value ?? items[0]?.value ?? '');
  const [focusIndex, setFocusIndex] = useState(0);
  const buttonRefs = useRef<(HTMLButtonElement | null)[]>([]);

  useEffect(() => {
    if (value !== undefined) {
      setActiveValue(value);
      const index = items.findIndex(item => item.value === value);
      setFocusIndex(Math.max(0, index));
    }
  }, [value, items]);

  const setActive = useCallback(
    (newValue: string) => {
      setActiveValue(newValue);
      onChange?.(newValue);
      const index = items.findIndex(item => item.value === newValue);
      setFocusIndex(Math.max(0, index));
    },
    [items, onChange]
  );

  const registerButtonRef = useCallback((index: number, el: HTMLButtonElement | null) => {
    buttonRefs.current[index] = el;
  }, []);

  const onKeyDownTab = useCallback(
    (event: React.KeyboardEvent, currentIndex: number) => {
      let nextIndex = currentIndex;
      let handled = false;

      switch (event.key) {
        case 'ArrowLeft':
        case 'ArrowUp':
          nextIndex = (currentIndex - 1 + items.length) % items.length;
          handled = true;
          break;
        case 'ArrowRight':
        case 'ArrowDown':
          nextIndex = (currentIndex + 1) % items.length;
          handled = true;
          break;
        case 'Home':
          nextIndex = 0;
          handled = true;
          break;
        case 'End':
          nextIndex = items.length - 1;
          handled = true;
          break;
        default:
          break;
      }

      if (handled) {
        event.preventDefault();
        setFocusIndex(nextIndex);
        buttonRefs.current[nextIndex]?.focus();
        setActive(items[nextIndex].value);
      }
    },
    [items, setActive]
  );

  return {
    activeValue,
    focusIndex,
    registerButtonRef,
    setActive,
    onKeyDownTab,
  };
}
