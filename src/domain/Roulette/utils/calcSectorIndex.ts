export const calcSectorIndex = (angle: number, itemCount: number) => {
  const step = (2 * Math.PI) / itemCount;

  let normal = ((angle % (2 * Math.PI)) + 2 * Math.PI) % (2 * Math.PI);
  normal = (normal + Math.PI / 2) % (2 * Math.PI);
  const reversed = (2 * Math.PI - normal) % (2 * Math.PI);

  return Math.floor(reversed / step);
};
