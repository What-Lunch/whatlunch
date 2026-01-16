export namespace Menu {
  export enum Category {
    ALL = 'all',
    BEST = 'best',
    KOREAN = 'korean',
    CHINESE = 'chinese',
    JAPANESE = 'japanese',
    WESTERN = 'western',
    SNACK = 'snack',
  }

  export enum Context {
    LUNCH = 'lunch',
    SOLO = 'solo',
    GROUP = 'group',
    DIET = 'diet',
    DATE = 'date',
    STRESS = 'stress',
  }

  export interface GetMenuRes {
    id: string;
    name: string;
    category: Category;
    contexts: Context[];
    isBest: boolean;
    calorie?: number;
    createdAt: Date;
    updatedAt: Date;
  }

  export interface GetMenuReq {
    category?: Category;
    context?: Context;
    limit?: number;
  }
}
