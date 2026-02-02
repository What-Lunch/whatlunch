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
    user: {
      id: string;
      email: string;
      nickname: string;
      profileImage: string | null;
      provider?: string;
    };
  }

  interface MeRes {
    id: string;
    email: string;
    nickname: string;
    profileImage: string | null;
    provider?: string;
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

namespace Favorite {
  interface GetMyFavoritesRes extends Menu.GetMenuRes {
    _id: string;
    createdAt: string;
  }
}

namespace Faq {
  interface CreateFaqReq {
    name: string;
    email: string;
    message: string;
  }

  interface CreateFaqRes {
    faq: {
      id: number;
      name: string;
      email: string;
      message: string;
      createdAt: string;
    };
  }

  interface GetFaqsRes {
    id: number;
    name: string;
    email: string;
    message: string;
    createdAt: string;
  }
}
