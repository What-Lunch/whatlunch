// namespace Kakao {
//   type Status = 'OK' | 'ZERO_RESULT' | 'ERROR';

//   interface PlaceItem {
//     id: string;
//     place_name: string;
//     address_name: string;
//     road_address_name: string;
//     phone: string;
//     x: string;
//     y: string;
//   }

//   type PlacesSearchResult = PlaceItem[];

//   interface LatLng {
//     getLat(): number;
//     getLng(): number;
//   }

//   declare class Marker {
//     constructor(options: { map?: Maps | null; position: LatLng });
//     setMap(map: Maps | null): void;
//     getPosition(): LatLng;
//   }

//   declare class Maps {
//     constructor(container: HTMLElement, options: MapOptions);

//     setCenter(latlng: LatLng): void;
//     getCenter(): LatLng;
//     setLevel(
//       level: number,
//       options?: {
//         animate?: boolean | { duration: number; easing: string };
//         anchor?: LatLng;
//       }
//     ): void;
//   }
// }
