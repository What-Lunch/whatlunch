import { fetcherClient } from '@/lib/fetcher-client';
import { fetcherServer } from '@/lib/fetcher-server';

// 음식 도트 조회 (서버)
export const getMyFoodDotsServer = async (): Promise<string[]> => {
  return fetcherServer<string[]>('/users/me/food-dots', {
    method: 'GET',
  });
};

// 음식 도트 조회 (클라이언트)
export const getMyFoodDots = async (): Promise<string[]> => {
  return fetcherClient<string[]>('/users/me/food-dots', {
    method: 'GET',
  });
};

// 음식 도트 추가
export const addFoodDot = async (dotId: string): Promise<string[]> => {
  return fetcherClient<string[]>('/users/me/food-dots', {
    method: 'POST',
    body: JSON.stringify({ dotId }),
  });
};

// 음식 도트 제거
export const removeFoodDot = async (dotId: string): Promise<string[]> => {
  return fetcherClient<string[]>(`/users/me/food-dots/${dotId}`, {
    method: 'DELETE',
  });
};
