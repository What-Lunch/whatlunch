export function range(start: number, end: number): number[] {
  const result: number[] = [];

  if (start > end) return result;

  for (let i = start; i <= end; i++) {
    result.push(i);
  }

  return result;
}