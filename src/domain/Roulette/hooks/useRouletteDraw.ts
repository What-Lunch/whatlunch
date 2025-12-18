import { useCallback, useMemo } from 'react';

import { MenuItem } from '../utils/menuItem';

import { ROULETTE_STYLE } from '../constants/rouletteStyle';

const FULL_ANGLE = Math.PI * 2;

export function useRouletteDraw(items: MenuItem[], size: number, sectorColors: string[]) {
  const radius = useMemo(() => size / 2, [size]);

  const stepAngle = useMemo(() => {
    return items.length > 0 ? FULL_ANGLE / items.length : 0;
  }, [items.length]);

  // 단일 메뉴 렌더링
  const drawSingleItem = useCallback(
    (canvasContext: CanvasRenderingContext2D) => {
      canvasContext.beginPath();
      canvasContext.fillStyle = sectorColors[0];
      canvasContext.arc(radius, radius, radius - 4, 0, FULL_ANGLE);
      canvasContext.fill();

      canvasContext.save();
      canvasContext.translate(radius, radius);
      canvasContext.fillStyle = ROULETTE_STYLE.text.color;
      canvasContext.font = ROULETTE_STYLE.text.large;
      canvasContext.textAlign = 'center';
      canvasContext.textBaseline = 'middle';
      canvasContext.fillText(items[0].name, 0, 0);
      canvasContext.restore();
    },
    [items, sectorColors, radius]
  );

  // 섹터 + 텍스트 렌더링
  const drawSectors = useCallback(
    (canvasContext: CanvasRenderingContext2D, angle: number) => {
      items.forEach((item, index) => {
        const start = angle + stepAngle * index;
        const end = start + stepAngle;

        // 섹터 배경
        canvasContext.beginPath();
        canvasContext.moveTo(radius, radius);
        canvasContext.fillStyle = sectorColors[index];
        canvasContext.arc(radius, radius, radius - 4, start, end);
        canvasContext.fill();

        // 경계선
        canvasContext.lineWidth = ROULETTE_STYLE.stroke.width;
        canvasContext.strokeStyle = ROULETTE_STYLE.stroke.color;
        canvasContext.stroke();

        // 텍스트
        canvasContext.save();
        canvasContext.translate(radius, radius);
        canvasContext.rotate(start + stepAngle / 2);

        canvasContext.fillStyle = ROULETTE_STYLE.text.color;
        canvasContext.font = ROULETTE_STYLE.text.normal;
        canvasContext.textAlign = 'center';
        canvasContext.textBaseline = 'middle';

        // 글자가 뒤집히지 않도록 보정
        canvasContext.rotate(Math.PI);
        canvasContext.fillText(item.name, -radius * ROULETTE_STYLE.text.offsetRatio, 0);

        canvasContext.restore();
      });
    },
    [items, sectorColors, radius, stepAngle]
  );

  // 포인터 렌더링
  const drawPointer = useCallback(
    (canvasContext: CanvasRenderingContext2D) => {
      canvasContext.save();
      canvasContext.translate(radius, radius);

      const side = ROULETTE_STYLE.pointer.size;
      const edge = -(radius - ROULETTE_STYLE.pointer.margin);
      const triangleHeight = (side * Math.sqrt(3)) / 2;

      canvasContext.beginPath();
      canvasContext.moveTo(-side / 2, edge);
      canvasContext.lineTo(side / 2, edge);
      canvasContext.lineTo(0, edge + triangleHeight);
      canvasContext.closePath();

      canvasContext.fillStyle = ROULETTE_STYLE.pointer.color;
      canvasContext.fill();

      canvasContext.restore();
    },
    [radius]
  );

  // 전체 draw 함수
  const draw = useCallback(
    (canvasContext: CanvasRenderingContext2D, angle: number) => {
      canvasContext.clearRect(0, 0, size, size);

      if (items.length === 1) {
        drawSingleItem(canvasContext);
        return;
      }

      drawSectors(canvasContext, angle);
      drawPointer(canvasContext);
    },
    [items.length, size, drawSingleItem, drawSectors, drawPointer]
  );

  return draw;
}
