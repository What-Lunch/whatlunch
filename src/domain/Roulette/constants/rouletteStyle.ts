// Roulette 스타일을 SCSS 디자인 시스템에 맞게 재정의한 JS 스타일 토큰
export const ROULETTE_STYLE = {
  text: {
    color: '#334155', // f.color(text-primary)
    large: '700 28px Pretendard, sans-serif', // 폰트: 3XL
    normal: '600 20px Pretendard, sans-serif', // 폰트: XL
    offsetRatio: 0.45,
  },

  stroke: {
    color: 'rgba(0, 0, 0, 0.18)',
    width: 2,
  },

  pointer: {
    color: '#ef4444', // f.color(status-danger)
    size: 48,
    margin: 4,
  },

  wheel: {
    borderRadius: 9999,
    innerShadow: 'inset 0 0 25px rgba(0,0,0,0.2)',
    outerShadow: '0 10px 25px rgba(0,0,0,0.25)',
    background: {
      start: '#ffffff',
      end: '#e5e7eb',
    },
  },
} as const;
