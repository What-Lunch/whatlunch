declare namespace kakao.maps.services {
  /** Kakao Places API Status */
  export type Status =
    | 'OK'
    | 'ZERO_RESULT'
    | 'ERROR'
    | 'NOT_SUPPORTED'
    | 'INVALID_REQUEST'
    | 'OVER_QUERY_LIMIT';

  export interface Pagination {
    totalCount: number;
    current: number;
    last: number;
    gotoPage(page: number): void;
  }

  export interface PlacesSearchResultItem {
    id: string;
    place_name: string;
    road_address_name: string;
    address_name: string;
    x: string; // 경도 문자열
    y: string; // 위도 문자열
    phone?: string;
    place_url: string;
    category_group_code?: string;
    category_group_name?: string;
  }

  export interface PlacesSearchCB {
    (data: PlacesSearchResultItem[], status: Status, pagination?: Pagination): void;
  }

  export interface PlacesSearchOptions {
    location?: kakao.maps.LatLng;
    radius?: number;
    size?: number;
    page?: number;
    sort?: 'accuracy' | 'distance';
  }

  export class Places {
    keywordSearch(query: string, callback: PlacesSearchCB, options?: PlacesSearchOptions): void;

    categorySearch(category: string, callback: PlacesSearchCB, options?: PlacesSearchOptions): void;
  }
}
