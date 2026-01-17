import { fetcher } from '@/app/lib/fetcher';

type SignupPayload = {
  email: string;
  password: string;
  passwordConfirm: string;
  nickname: string;
};

type LoginPayload = {
  email: string;
  password: string;
};

type LoginResponse = {
  accessToken: string;
  expiresAt: string;
};

type MeResponse = {
  email: string;
  nickname: string;
  profileImage: string | null;
};

type UpdateMePayload = {
  nickname?: string;
  password?: string;
};

class AuthService {
  // 회원가입
  signup(data: SignupPayload): Promise<{ message: string }> {
    return fetcher<{ message: string }>('/auth/signup', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  // 로그인
  async login(data: LoginPayload): Promise<LoginResponse> {
    const res = await fetcher<LoginResponse>('/auth/login', {
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
  logout() {
    if (typeof window === 'undefined') return;

    localStorage.removeItem('accessToken');
    localStorage.removeItem('expiresAt');
  }

  // 내 정보 조회
  getMe(): Promise<MeResponse> {
    return fetcher<MeResponse>('/auth/me', {
      method: 'GET',
      auth: true,
    });
  }

  // 내 정보 수정
  updateMe(data: UpdateMePayload): Promise<MeResponse> {
    return fetcher<MeResponse>('/auth/me', {
      method: 'PATCH',
      body: JSON.stringify(data),
      auth: true,
    });
  }
}

// 싱글톤 인스턴스 export
export const authService = new AuthService();
