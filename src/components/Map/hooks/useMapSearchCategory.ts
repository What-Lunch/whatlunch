import { MutableRefObject, useCallback } from 'react';

import { MapPlace } from '../type';

export function useMapSearchCategory(
  kakaoRef: MutableRefObject<typeof window.kakao | null>,
  mapObjRef: MutableRefObject<kakao.maps.Map | null>,
  userLocationRef: MutableRefObject<{ lat: number; lng: number } | null>,
  createMarkers: (places: MapPlace[]) => void
) {
  const searchCategory = useCallback(
    (categoryCode: string, setPlaces: (data: MapPlace[]) => void) => {
      const kakao = kakaoRef.current;
      const map = mapObjRef.current;
      const userLoc = userLocationRef.current;

      if (!kakao || !map || !userLoc) return;

      const ps = new kakao.maps.services.Places();

      const options = {
        location: new kakao.maps.LatLng(userLoc.lat, userLoc.lng),
        radius: 5000,
      };

      ps.categorySearch(
        categoryCode,
        (data: MapPlace[], status: kakao.maps.services.Status) => {
          const { Status } = kakao.maps.services;

          if (status === Status.OK) {
            setPlaces(data);
            createMarkers(data);

            // 지도 센터 이동
            if (data.length > 0) {
              const first = data[0];
              map.setCenter(new kakao.maps.LatLng(Number(first.y), Number(first.x)));
            }
            return;
          }

          if (status === 'ZERO_RESULT') {
            setPlaces([]);
            createMarkers([]);
            return;
          }

          console.warn('[Kakao Places] categorySearch failed:', status);
          setPlaces([]);
          createMarkers([]);
        },
        options
      );
    },
    [kakaoRef, mapObjRef, userLocationRef, createMarkers]
  );

  return { searchCategory };
}
