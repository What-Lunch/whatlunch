namespace Auth {
  interface RegisterReq {
    email: string;
    password: string;
    passwordConfirm: string;
    nickname: string;
  }

  interface LoginReq {
    email: string;
    password: string;
  }

  interface LoginRes {
    accessToken: string;
    expiresAt: string;
    user: {
      email: string;
      nickname: string;
      profileImage: string | null;
    };
  }

  interface MeRes {
    email: string;
    nickname: string;
    profileImage: string | null;
  }

  interface UpdateMeReq {
    nickname?: string;
    profileImage?: string | null;
    password?: string;
  }
}

namespace Menu {
  interface GetMenuRes {
    id: string;
    name: string;
    category: import('./enum').Category;
    contexts: import('./enum').Context[];
    isBest: boolean;
    calorie?: number;
    createdAt: Date | string;
    updatedAt: Date | string;
  }

  interface GetMenuReq {
    category?: import('./enum').Category | import('./enum').Category[];
    context?: import('./enum').Context | import('./enum').Context[] | undefined;
    limit?: number;
  }
}

declare namespace Favorite {
  interface Menu {
    id: string;
    name: string;
    category: string;
  }

  interface GetMyFavoritesRes {
    id: string;
    menuId: Menu | null;
    createdAt: string;
  }
}
