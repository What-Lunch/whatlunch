/* eslint-disable @typescript-eslint/no-explicit-any */
declare namespace kakao {
  namespace maps {
    function load(callback: () => void): void;

    class LatLng {
      constructor(lat: number, lng: number);
      getLat(): number;
      getLng(): number;
    }

    class Map {
      constructor(container: HTMLElement, options: any);
      setCenter(latlng: LatLng): void;
      getCenter(): LatLng;
      relayout(): void;
      getLevel(): number;
      setLevel(level: number): void;
    }

    class Marker {
      constructor(options: any);
      setImage(image: MarkerImage | null): void;
      getPosition(): LatLng;
      setMap(map: Map | null): void;
      setPosition(latlng: LatLng): void;
    }

    class MarkerImage {
      constructor(src: string, size: Size);
    }

    class Size {
      constructor(w: number, h: number);
    }

    class InfoWindow {
      constructor(options: any);
      open(map: Map, marker: Marker): void;
      close(): void;
    }

    namespace event {
      function addListener(target: any, type: string, handler: () => void): void;
    }

    namespace services {
      /** Pagination 타입 */
      interface Pagination {
        current: number;
        last: number;
        hasNextPage: boolean;
        hasPrevPage: boolean;
        gotoPage: (page: number) => void;
      }

      /** Status string literal 타입 */
      const Status: {
        OK: 'OK';
        ZERO_RESULT: 'ZERO_RESULT';
        ERROR: 'ERROR';
      };

      /** Places API */
      class Places {
        keywordSearch(
          keyword: string,
          callback: (
            data: any[],
            status: (typeof Status)[keyof typeof Status],
            pagination: Pagination
          ) => void,
          options?: any
        ): void;

        categorySearch(
          code: string,
          callback: (
            data: any[],
            status: (typeof Status)[keyof typeof Status],
            pagination: Pagination
          ) => void,
          options?: any
        ): void;
      }
    }

    /** Marker Cluster */
    class MarkerClusterer {
      constructor(options: { map: Map; averageCenter?: boolean; minLevel?: number });
      addMarkers(markers: Marker[]): void;
      clear(): void;
      getMarkers(): Marker[];
    }
  }
}
