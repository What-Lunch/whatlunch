'use client';

import { useCallback } from 'react';

const KAKAO_JS_KEY = process.env.NEXT_PUBLIC_KAKAO_JS_KEY;

// 환경별 공유 URL 분기
const SHARE_URL =
  process.env.NODE_ENV === 'development' ? 'http://localhost:3000' : 'https://whatlunch.vercel.app';

// 카카오 공유용 이미지 URL (항상 배포 URL - localhost는 카카오에서 접근 불가)
const PRODUCTION_URL = 'https://whatlunch.vercel.app';

interface ShareOptions {
  title: string;
  description: string;
  imageUrl?: string;
  webUrl?: string;
  buttonTitle?: string;
  roomCode?: string;
}

// 클릭 시점에 Kakao SDK 초기화 보장
const ensureKakaoInit = (): boolean => {
  if (typeof window === 'undefined') return false;
  if (!window.Kakao) return false;
  if (!KAKAO_JS_KEY) return false;

  // 아직 초기화되지 않았다면 초기화
  if (!window.Kakao.isInitialized()) {
    try {
      window.Kakao.init(KAKAO_JS_KEY);
    } catch {
      return false;
    }
  }

  return window.Kakao.isInitialized();
};

export function useKakaoShare() {
  const shareToKakao = useCallback((options: ShareOptions): boolean => {
    // 클릭 시점에 초기화 보장
    const isInitialized = ensureKakaoInit();
    if (!isInitialized) return false;

    // 방 코드가 있으면 방 URL로 연결, 없으면 기본 URL
    const webUrl = options.roomCode
      ? `${SHARE_URL}/rooms/${options.roomCode}`
      : options.webUrl || SHARE_URL;

    const imageUrl = options.imageUrl
      ? options.imageUrl.startsWith('http')
        ? options.imageUrl
        : `${PRODUCTION_URL}${options.imageUrl}`
      : `${PRODUCTION_URL}/og.png`;

    const shareParams = {
      objectType: 'feed' as const,
      content: {
        title: options.title,
        description: options.description,
        imageUrl,
        link: {
          webUrl,
          mobileWebUrl: webUrl,
        },
      },
      buttons: [
        {
          title: options.buttonTitle || '메뉴 보러가기',
          link: {
            webUrl,
            mobileWebUrl: webUrl,
          },
        },
      ],
    };

    try {
      window.Kakao.Share.sendDefault(shareParams);
      return true;
    } catch {
      return false;
    }
  }, []);

  // isReady는 즉시 계산
  const isReady = typeof window !== 'undefined' && !!window.Kakao && window.Kakao.isInitialized?.();

  return { isReady, shareToKakao };
}
