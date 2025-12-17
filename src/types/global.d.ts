declare global {
  interface Window {
    kakao: any;
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

    interface LatLng {
      getLat(): number;
      getLng(): number;
    }

    class Marker {
      constructor(options: { map?: Maps | null; position: LatLng });
      setMap(map: Maps | null): void;
      getPosition(): LatLng;
    }

    class Maps {
      constructor(container: HTMLElement | null, options: MapOptions);
      setCenter(latlng: LatLng): void;
      getCenter(): LatLng;
      setLevel(
        level: number,
        options?: {
          animate?: boolean | { duration: number; easing: string };
          anchor?: LatLng;
        }
      ): void;
    }

    interface MapOptions {
      center: LatLng;
      level?: number;
    }

    // namespace maps {
    //   function load(callback: () => void): void;

    //   class Map extends Maps {}
    //   class LatLng {
    //     constructor(lat: number, lng: number);
    //     getLat(): number;
    //     getLng(): number;
    //   }
    //   class Marker {
    //     constructor(options: { map?: Map | null; position: LatLng });
    //     setMap(map: Map | null): void;
    //     getPosition(): LatLng;
    //   }

    //   namespace services {
    //     class Places {
    //       keywordSearch(
    //         keyword: string,
    //         callback: (data: PlaceItem[], status: Status) => void,
    //         options?: any
    //       ): void;
    //     }
    //     const Status: {
    //       OK: 'OK';
    //       ZERO_RESULT: 'ZERO_RESULT';
    //       ERROR: 'ERROR';
    //     };
    //   }
    // }
  }
}

export {};
