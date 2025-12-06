export const generatePalette = (count: number): string[] => {
  if (count === 0) return [];
  const palette = [];
  for (let i = 0; i < count; i++) {
    const hue = (360 / count) * i;
    palette.push(`hsl(${hue}, 70%, 65%)`);
  }
  return palette;
};
