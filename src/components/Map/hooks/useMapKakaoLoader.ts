import { useCallback } from 'react';

export function useMapKakaoLoader() {
  const loadKakao = useCallback(() => {
    return new Promise<void>((resolve, reject) => {
      // 이미 로드된 경우
      if (window.kakao?.maps) return resolve();

      // 이미 script tag가 있는 경우
      const existing = document.getElementById('kakao-sdk');
      if (existing) {
        existing.addEventListener('load', () => resolve());
        existing.addEventListener('error', () => reject('Kakao SDK failed to load'));
        return;
      }

      // 새 스크립트 삽입
      const script = document.createElement('script');
      script.id = 'kakao-sdk';
      script.src = `//dapi.kakao.com/v2/maps/sdk.js?autoload=false&appkey=${
        process.env.NEXT_PUBLIC_KAKAO_MAP_KEY
      }&libraries=services,clusterer`;

      script.onload = () => resolve();
      script.onerror = () => reject('Kakao SDK failed to load');

      document.head.appendChild(script);
    });
  }, []);

  const waitForKakao = useCallback(() => {
    return new Promise<void>((resolve, reject) => {
      const start = Date.now();

      const timer = setInterval(() => {
        if (window.kakao?.maps) {
          clearInterval(timer);
          return resolve();
        }

        // timeout 10초
        if (Date.now() - start > 10000) {
          clearInterval(timer);
          return reject('Kakao maps load timeout');
        }
      }, 50);
    });
  }, []);

  return { loadKakao, waitForKakao };
}
