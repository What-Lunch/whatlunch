import { fetcher } from '@/app/lib/fetcher';

class AuthService {
  postSignup(data: Auth.RegisterReq): Promise<{ message: string }> {
    return fetcher<{ message: string }>('/auth/signup', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

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

  postLogout() {
    if (typeof window === 'undefined') return;
    localStorage.removeItem('accessToken');
    localStorage.removeItem('expiresAt');
  }

  getMe(): Promise<Auth.MeRes> {
    return fetcher<Auth.MeRes>('/auth/me', {
      method: 'GET',
      auth: true,
    });
  }

  updateMe(data: Auth.UpdateMeReq): Promise<Auth.MeRes> {
    return fetcher<Auth.MeRes>('/auth/me', {
      method: 'PATCH',
      body: JSON.stringify(data),
      auth: true,
    });
  }

  deleteProfileImage(): Promise<Auth.MeRes> {
    return fetcher<Auth.MeRes>('/auth/me/profile-image', {
      method: 'DELETE',
      auth: true,
    });
  }

  getProfileImagePresign(contentType: string): Promise<{
    uploadUrl: string;
    fileUrl: string;
  }> {
    return fetcher('/auth/profile-image/presign', {
      method: 'POST',
      body: JSON.stringify({ contentType }),
      auth: true,
    });
  }
}

export const authService = new AuthService();
