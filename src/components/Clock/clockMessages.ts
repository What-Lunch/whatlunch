import { formatRemain } from './formatRemain';

const beforeLunchMessages = [
  (remain: string) => `점심시간까지 ${formatRemain(remain)} 남았다!`,
  (remain: string) => `오늘 뭐 먹을지 정했나? 앞으로 ${formatRemain(remain)} 남았어`,
  (remain: string) => `${formatRemain(remain)}. 조금만 더 버티면 점심이다!`,
];

const afterLunchMessages = [
  () => `점심시간이 지났어요. 맛있게 먹었나요?`,
  () => `점심시간은 끝났지만 하루는 계속돼요!`,
  () => `벌써 점심 지나감!`,
];

export function getBeforeLunchMessage(remain: string) {
  const idx = Math.floor(Math.random() * beforeLunchMessages.length);
  return beforeLunchMessages[idx](remain);
}

export function getAfterLunchMessage() {
  const idx = Math.floor(Math.random() * afterLunchMessages.length);
  return afterLunchMessages[idx]();
}
