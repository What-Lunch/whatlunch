const BASE_URL = process.env.BASE_URL ?? 'https://backend-pik.onrender.com';

// fetcher 유틸리티 함수 및 관련 타입 정의
export interface FetchOptions extends RequestInit {
  auth?: boolean;
}

// API 에러 응답 타입
export interface ApiErrorResponse {
  message?: string;
}

// 범용 fetcher 함수 (JSON 응답 필수)
export async function fetcher<T>(url: string, options: FetchOptions = {}): Promise<T> {
  // SSG / SSR 방어
  if (typeof window === 'undefined') {
    throw new Error('fetcher should not be called during server rendering');
  }

  if (!BASE_URL) {
    throw new Error('API base URL is not configured');
  }

  const headers = new Headers(options.headers);

  if (!headers.has('Content-Type')) {
    headers.set('Content-Type', 'application/json');
  }

  // 인증 토큰 자동 첨부
  if (options.auth) {
    const token = localStorage.getItem('accessToken');
    if (token) {
      headers.set('Authorization', `Bearer ${token}`);
    }
  }

  const res = await fetch(`${BASE_URL}${url}`, {
    ...options,
    headers,
    credentials: 'include',
  });

  // 에러 통합 처리
  if (!res.ok) {
    let message = '요청에 실패했습니다';

    try {
      const data: ApiErrorResponse = await res.json();
      if (data?.message) {
        message = data.message;
      }
    } catch {
      // JSON 파싱 실패 시 기본 메시지 유지
    }

    throw new Error(message);
  }

  const text = await res.text();

  // JSON 파싱 로직 방어
  if (!text) {
    throw new Error(`Unexpected empty response: ${res.status} ${res.url}`);
  }

  return JSON.parse(text) as T;
}
