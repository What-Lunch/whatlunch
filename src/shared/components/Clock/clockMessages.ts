import { formatRemain } from './formatRemain';

const beforeLunchMessages = [
  (remain: string) => `점심시간까지 ${formatRemain(remain)} 남았다!`,
  (remain: string) => `오늘 뭐 먹을지 정했나? ${formatRemain(remain)} 남았어`,
  (remain: string) => `${formatRemain(remain)}. 조금만 더 버티면 점심이다!`,
];

const afterLunchMessages = [
  () => '점심시간이 지났어요. 맛있게 먹었나요?',
  () => '점심 끝! 이제 오후네요',
  () => '벌써 점심 지나감!',
];

const dinnerTimeMessages = [
  () => '저녁 먹을 시간이에요!',
  () => '이제 저녁 드세요!',
  () => '오늘 하루 마무리는 저녁부터',
  () => '배고플 시간… 저녁 갑시다',
];

function pickRandom<T>(arr: T[]): T {
  return arr[Math.floor(Math.random() * arr.length)];
}

export function getBeforeLunchMessage(remain: string) {
  return pickRandom(beforeLunchMessages)(remain);
}

export function getAfterLunchMessage() {
  return pickRandom(afterLunchMessages)();
}

export function getDinnerTimeMessage() {
  return pickRandom(dinnerTimeMessages)();
}
