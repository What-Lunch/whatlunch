const BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL!;

// fetcher 유틸리티 함수 및 관련 타입 정의
export interface FetchOptions extends RequestInit {
  auth?: boolean;
}

// API 에러 응답 타입
export interface ApiErrorResponse {
  message?: string;
}

// 범용 fetcher 함수
export async function fetcher<T>(url: string, options: FetchOptions = {}): Promise<T> {
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
  });

  // 에러 통합 처리
  if (!res.ok) {
    let message = '요청에 실패했습니다';

    try {
      const data: ApiErrorResponse = await res.json();
      if (data?.message) {
        message = data.message;
      }
    } catch {}

    throw new Error(message);
  }

  return res.json() as Promise<T>;
}
