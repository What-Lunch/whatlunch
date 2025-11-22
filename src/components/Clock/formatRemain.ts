export function formatRemain(remain: string) {
  if (remain === 'passed') return '';

  if (!remain || remain === '00:00:00') return '0초';

  const [h, m, s] = remain.split(':').map(Number);

  const parts = [];
  if (h > 0) parts.push(`${h}시간`);
  if (m > 0) parts.push(`${m}분`);
  if (s > 0) parts.push(`${s}초`);

  return parts.join(' ');
}
