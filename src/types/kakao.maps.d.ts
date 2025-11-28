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
    }

    class Marker {
      constructor(options: any);
      setImage(image: MarkerImage | null): void;
      getPosition(): LatLng;
      setMap(map: Map | null): void;
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
      class Places {
        keywordSearch(keyword: string, callback: (data: any[], status: string) => void): void;

        categorySearch(
          code: string,
          callback: (data: any[], status: string) => void,
          options?: any
        ): void;
      }

      const Status: {
        OK: string;
      };
    }

    /** 클러스터러 타입 정의 추가 */
    class MarkerClusterer {
      constructor(options: { map: Map; averageCenter?: boolean; minLevel?: number });

      addMarkers(markers: Marker[]): void;
      clear(): void;
      getMarkers(): Marker[];
    }
  }
}
