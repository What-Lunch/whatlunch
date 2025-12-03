import { useEffect, useRef } from 'react';
import { generatePalette } from '@/domain/Roulette/utils/generatePalette';

export function useSectorColors(items: string[]) {
  const colorsRef = useRef<string[]>([]);

  useEffect(() => {
    colorsRef.current = generatePalette(items.length);
  }, [items]);

  return colorsRef;
}
