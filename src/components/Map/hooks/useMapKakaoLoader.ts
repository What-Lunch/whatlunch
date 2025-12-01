import { useCallback } from 'react';

let kakaoLoadPromise: Promise<void> | null = null;

export function useMapKakaoLoader() {
  const loadKakao = useCallback(() => {
    if (kakaoLoadPromise) return kakaoLoadPromise;

    kakaoLoadPromise = new Promise<void>((resolve, reject) => {
      if (typeof window !== 'undefined' && window.kakao?.maps) {
        resolve();
        return;
      }

      const existing = document.getElementById('kakao-sdk');
      if (existing) {
        existing.addEventListener('load', () => resolve());
        existing.addEventListener('error', () => reject('Kakao SDK failed to load'));
        return;
      }

      const script = document.createElement('script');
      script.id = 'kakao-sdk';
      script.src = `//dapi.kakao.com/v2/maps/sdk.js?autoload=false&appkey=${
        process.env.NEXT_PUBLIC_KAKAO_MAP_KEY
      }&libraries=services,clusterer`;

      script.onload = () => resolve();
      script.onerror = () => reject('Kakao SDK failed to load');

      document.head.appendChild(script);
    });

    return kakaoLoadPromise;
  }, []);

  const waitForKakao = useCallback(() => {
    return new Promise<void>((resolve, reject) => {
      const start = Date.now();
      const timer = setInterval(() => {
        if (window.kakao?.maps) {
          clearInterval(timer);
          resolve();
        }

        // timeout 10초
        if (Date.now() - start > 10000) {
          clearInterval(timer);
          reject('Kakao maps load timeout');
        }
      }, 50);
    });
  }, []);

  return { loadKakao, waitForKakao };
}
