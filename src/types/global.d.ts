declare global {
  interface Window {
    kakao: {
      maps: typeof kakao.maps;
    };
  }

  namespace Kakao {
    type Status = 'OK' | 'ZERO_RESULT' | 'ERROR';

    interface PlaceItem {
      id: string;
      place_name: string;
      address_name: string;
      road_address_name: string;
      phone: string;
      x: string;
      y: string;
    }

    type PlacesSearchResult = PlaceItem[];

    namespace maps {
      class LatLng {
        constructor(lat: number, lng: number);
        getLat(): number;
        getLng(): number;
      }
      class Marker {
        constructor(options: { map?: maps.Map | null; position: maps.LatLng });
        setMap(map: maps.Map | null): void;
        getPosition(): maps.LatLng;
      }
      class InfoWindow {
        constructor(options?: { content?: string; removable?: boolean });
        open(map: maps.Map, marker: maps.Marker): void;
        close(): void;
        setContent(content: string): void;
      }
      class Map {
        constructor(container: HTMLElement | null, options: maps.MapOptions);
        setCenter(latlng: maps.LatLng): void;
        getCenter(): maps.LatLng;
        setLevel(
          level: number,
          options?: {
            animate?: boolean | { duration: number; easing: string };
            anchor?: maps.LatLng;
          }
        ): void;
      }
      interface MapOptions {
        center: maps.LatLng;
        level?: number;
      }
      namespace services {
        class Places {
          keywordSearch(
            keyword: string,
            callback: (data: Kakao.PlacesSearchResult, status: Kakao.Status) => void,
            options?: object
          ): void;
        }
        const Status: {
          OK: 'OK';
          ZERO_RESULT: 'ZERO_RESULT';
          ERROR: 'ERROR';
        };
      }
      namespace event {
        type MouseEventListener = (mouseEvent: object) => void;
        function addListener(
          target: object,
          type: string,
          handler: MouseEventListener
        ): MouseEventListener;
        function removeListener(target: object, type: string, handler: MouseEventListener): void;
      }

      function load(callback: () => void): void;
    }
  }
}

export {};
