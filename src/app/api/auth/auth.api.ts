import { fetcher } from '../fetcher';

// 회원가입 API
export const signup = (data: {
  email: string;
  password: string;
  passwordConfirm: string;
  nickname: string;
}) => {
  return fetcher('/auth/signup', {
    method: 'POST',
    body: JSON.stringify(data),
  });
};

// 로그인 API
export const login = async (data: { email: string; password: string }) => {
  const res = await fetcher<{
    accessToken: string;
    expiresAt: string;
  }>('/auth/login', {
    method: 'POST',
    body: JSON.stringify(data),
  });

  localStorage.setItem('accessToken', res.accessToken); // 액세스 토큰
  localStorage.setItem('expiresAt', res.expiresAt); // 만료 시간

  return res;
};

// 내 정보 조회 API
export const getMe = () => {
  return fetcher<{
    _id: string;
    email: string;
    nickname: string;
  }>('/auth/me', {
    method: 'GET',
    auth: true,
  });
};
