import { fetcher } from '@/app/lib/fetcher';

class AuthService {
  // 회원가입
  postSignup(data: Auth.RegisterReq): Promise<{ message: string }> {
    return fetcher<{ message: string }>('/auth/signup', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  // 로그인
  async postLogin(data: Auth.LoginReq): Promise<Auth.LoginRes> {
    const res = await fetcher<Auth.LoginRes>('/auth/login', {
      method: 'POST',
      body: JSON.stringify(data),
    });

    if (typeof window !== 'undefined') {
      localStorage.setItem('accessToken', res.accessToken);
      localStorage.setItem('expiresAt', res.expiresAt);
    }

    return res;
  }

  // 로그아웃 (토큰 제거)
  postLogout() {
    if (typeof window === 'undefined') return;

    localStorage.removeItem('accessToken');
    localStorage.removeItem('expiresAt');
  }

  // 내 정보 조회
  getMe(): Promise<Auth.MeRes> {
    return fetcher<Auth.MeRes>('/auth/me', {
      method: 'GET',
      auth: true,
    });
  }
  // 내 정보 수정
  updateMe(data: Auth.UpdateMeReq): Promise<Auth.MeRes> {
    return fetcher<Auth.MeRes>('/auth/me', {
      method: 'PATCH',
      body: JSON.stringify(data),
      auth: true,
    });
  }
}

export const authService = new AuthService();
