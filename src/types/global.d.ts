declare global {
  interface Window {
    kakao: typeof kakao;
  }
}

export namespace kakao {
  namespace maps {
    function load(callback: () => void): void;

    class Map {
      constructor(container: HTMLElement | null, options: MapOptions);
      setCenter(latlng: LatLng): void;
      getCenter(): LatLng;
      setLevel(level: number): void;
    }
    class LatLng {
      constructor(lat: number, lng: number);
      getLat(): number;
      getLng(): number;
    }
    class Marker {
      constructor(options: { map?: Map | null; position: LatLng });
      setMap(map: Map | null): void;
      getPosition(): LatLng;
    }
    namespace services {
      type Status = 'OK' | 'ZERO_RESULT' | 'ERROR';

      const Status: {
        OK: 'OK';
        ZERO_RESULT: 'ZERO_RESULT';
        ERROR: 'ERROR';
      };

      class Places {
        keywordSearch(
          keyword: string,
          callback: (data: PlaceItem[], status: Status) => void,
          options?: any
        ): void;
      }
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
    }
  }
}
