import { fetcher } from '@/app/lib/fetcher';

class AuthService {
  postSignup(data: Auth.RegisterReq): Promise<Auth.MeRes> {
    return fetcher('/auth/signup', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async postLogin(data: Auth.LoginReq): Promise<Auth.LoginRes> {
    return await fetcher<Auth.LoginRes>('/auth/login', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async postLogout(): Promise<void> {
    await fetcher('/auth/logout', {
      method: 'POST',
    });
  }

  getMe(): Promise<Auth.MeRes> {
    return fetcher<Auth.MeRes>('/auth/me', {
      method: 'GET',
    });
  }

  async refresh(): Promise<{ user: Auth.MeRes }> {
    return fetcher<{ user: Auth.MeRes }>('/auth/refresh', {
      method: 'POST',
    });
  }

  updateMe(data: Auth.UpdateMeReq): Promise<Auth.MeRes> {
    return fetcher<Auth.MeRes>('/auth/me', {
      method: 'PATCH',
      body: JSON.stringify(data),
    });
  }

  deleteProfileImage(): Promise<Auth.MeRes> {
    return fetcher<Auth.MeRes>('/auth/me/profile-image', {
      method: 'DELETE',
      auth: true,
    });
  }

  createProfileImagePresign(contentType: string): Promise<{
    uploadUrl: string;
    fileUrl: string;
  }> {
    return fetcher('/auth/profile-image/presign', {
      method: 'POST',
      body: JSON.stringify({ contentType }),
      auth: true,
    });
  }

  // 구글 로그인
  async loginWithGoogle({ idToken }: { idToken: string }): Promise<Auth.LoginRes> {
    const res = await fetcher<Auth.LoginRes>('/auth/oauth/google', {
      method: 'POST',
      body: JSON.stringify({ idToken }),
    });

    return {
      user: res.user,
      accessToken: '',
      expiresAt: '',
    };
  }
}

export const authService = new AuthService();
