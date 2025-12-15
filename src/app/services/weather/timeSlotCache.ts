export type TimeSlot = 'morning' | 'evening';

// 좌표 정규화 (약 1km 단위, 캐시 키 통일용)
export function toLocKeyParts(lat: number, lon: number) {
  const fixedLat = lat.toFixed(2);
  const fixedLon = lon.toFixed(2);

  return {
    fixedLat,
    fixedLon,
    locKey: `lat${fixedLat}_lon${fixedLon}`,
  };
}

// KST 기준 오전/저녁 구분 (06~18 / 18~06)
export function getCurrentTimeSlotKST(): TimeSlot {
  const hour = Number(
    new Intl.DateTimeFormat('en-US', {
      timeZone: 'Asia/Seoul',
      hour: '2-digit',
      hour12: false,
    })
      .format(new Date())
      .trim()
  );

  return hour >= 6 && hour < 18 ? 'morning' : 'evening';
}

// KST 기준 다음 06:00 또는 18:00까지 남은 초 계산
export function secondsUntilNextKstBoundary() {
  const parts = new Intl.DateTimeFormat('en-US', {
    timeZone: 'Asia/Seoul',
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    hour12: false,
  }).formatToParts(new Date());

  const get = (t: string) => Number(parts.find(p => p.type === t)?.value ?? 0);

  const y = get('year');
  const m = get('month') - 1;
  const d = get('day');
  const h = get('hour');
  const min = get('minute');
  const sec = get('second');

  const nowKstLike = new Date(y, m, d, h, min, sec);

  let targetHour = 6;
  let addDay = 0;

  if (h < 6) {
    targetHour = 6;
  } else if (h < 18) {
    targetHour = 18;
  } else {
    targetHour = 6;
    addDay = 1;
  }

  const next = new Date(y, m, d + addDay, targetHour, 0, 0);

  const diffSeconds = Math.ceil((next.getTime() - nowKstLike.getTime()) / 1000);

  return Math.max(60, diffSeconds);
}
