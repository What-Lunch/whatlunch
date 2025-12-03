import { useCallback } from 'react';

export function useRouletteDraw(
  items: string[],
  size: number,
  radius: number,
  sectorColors: React.MutableRefObject<string[]>
) {
  const draw = useCallback(
    (ctx: CanvasRenderingContext2D, angle: number) => {
      ctx.clearRect(0, 0, size, size);

      if (items.length === 1) {
        const color = sectorColors.current[0];

        ctx.beginPath();
        ctx.fillStyle = color;
        ctx.arc(radius, radius, radius - 4, 0, Math.PI * 2);
        ctx.fill();

        ctx.save();
        ctx.translate(radius, radius);
        ctx.fillStyle = '#333';
        ctx.font = 'bold 28px sans-serif';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText(items[0], 0, 0);
        ctx.restore();
        return;
      }

      const step = (2 * Math.PI) / items.length;

      items.forEach((item, i) => {
        const start = angle + step * i;
        const end = angle + step * (i + 1);

        ctx.beginPath();
        ctx.moveTo(radius, radius);
        ctx.fillStyle = sectorColors.current[i];
        ctx.arc(radius, radius, radius - 4, start, end);
        ctx.fill();

        ctx.lineWidth = 2;
        ctx.strokeStyle = 'rgba(0,0,0,0.18)';
        ctx.stroke();

        ctx.save();
        ctx.translate(radius, radius);
        ctx.rotate(start + step / 2);
        ctx.fillStyle = '#333';
        ctx.font = 'bold 20px sans-serif';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.rotate(Math.PI);
        ctx.fillText(item, -radius * 0.45, 0);
        ctx.restore();
      });

      ctx.save();
      ctx.translate(radius, radius);

      const edge = -(radius - 4);
      const side = 42;
      const h = (side * Math.sqrt(3)) / 2;

      ctx.beginPath();
      ctx.moveTo(-side / 2, edge);
      ctx.lineTo(side / 2, edge);
      ctx.lineTo(0, edge + h);
      ctx.closePath();
      ctx.fillStyle = '#ff4d4d';
      ctx.fill();

      ctx.restore();
    },
    [items, size, radius, sectorColors]
  );

  return draw;
}
