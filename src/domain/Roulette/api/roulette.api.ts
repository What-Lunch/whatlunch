import { Category, Context } from '@/types/enum';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';

interface MenuResponse {
  data: Menu.GetMenuRes[];
}

export const rouletteApi = {
  /**
   * 카테고리별 메뉴 조회
   */
  async getMenusByCategory(category: Category, roomId: string): Promise<Menu.GetMenuRes[]> {
    try {
      const response = await fetch(
        `${API_BASE_URL}/menus/roulette?category=${category}&roomId=${roomId}`,
        {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
          credentials: 'include',
        }
      );

      if (!response.ok) {
        throw new Error(`API Error: ${response.status}`);
      }

      const data: MenuResponse = await response.json();
      return data.data || [];
    } catch (error) {
      console.error('[API] 메뉴 조회 실패 (카테고리):', error);
      return [];
    }
  },

  /**
   * 상황별 메뉴 조회
   */
  async getMenusByContext(context: Context, roomId: string): Promise<Menu.GetMenuRes[]> {
    try {
      const response = await fetch(
        `${API_BASE_URL}/menus/roulette?context=${context}&roomId=${roomId}`,
        {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
          credentials: 'include',
        }
      );

      if (!response.ok) {
        throw new Error(`API Error: ${response.status}`);
      }

      const data: MenuResponse = await response.json();
      return data.data || [];
    } catch (error) {
      console.error('[API] 메뉴 조회 실패 (상황별):', error);
      return [];
    }
  },

  /**
   * 모든 메뉴 조회
   */
  async getAllMenus(roomId: string): Promise<Menu.GetMenuRes[]> {
    try {
      const url = `${API_BASE_URL}/menus?roomId=${roomId}`;
      console.log('[API] 전체 메뉴 요청:', { url, roomId, API_BASE_URL });

      const response = await fetch(url, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
      });

      console.log('[API] 응답 상태:', response.status, response.statusText);

      if (!response.ok) {
        const errorText = await response.text();
        console.error('[API] 오류 응답:', errorText);
        throw new Error(`API Error: ${response.status} - ${errorText}`);
      }

      const data: MenuResponse = await response.json();
      console.log('[API] 메뉴 데이터:', data);
      return data.data || [];
    } catch (error) {
      console.error('[API] 메뉴 조회 실패:', error);
      return [];
    }
  },
};
