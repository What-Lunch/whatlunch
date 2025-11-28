import { MutableRefObject, useCallback } from 'react';
import { MapPlace } from '../type';

export function useMapSearchKeyword(
  kakaoRef: MutableRefObject<typeof window.kakao | null>,
  mapObjRef: MutableRefObject<kakao.maps.Map | null>,
  createMarkers: (places: MapPlace[]) => void
) {
  const searchKeyword = useCallback(
    (keyword: string, setPlaces: (places: MapPlace[]) => void) => {
      const text = keyword.trim();

      const kakao = kakaoRef.current;
      const map = mapObjRef.current;

      if (!kakao || !map) return;

      if (!text) {
        setPlaces([]);
        createMarkers([]);
        return;
      }

      const ps = new kakao.maps.services.Places();

      ps.keywordSearch(text, (data: MapPlace[], status: kakao.maps.services.Status) => {
        const { Status } = kakao.maps.services;

        if (status === Status.OK) {
          setPlaces(data);
          createMarkers(data);
          // 첫 결과 중심으로 이동
          if (data.length > 0) {
            map.setCenter(new kakao.maps.LatLng(Number(data[0].y), Number(data[0].x)));
          }

          return;
        }

        if (status === 'ZERO_RESULT') {
          setPlaces([]);
          createMarkers([]);
          return;
        }

        console.warn('[Kakao Places] Keyword search failed:', status);
        setPlaces([]);
        createMarkers([]);
      });
    },
    [kakaoRef, mapObjRef, createMarkers]
  );

  return { searchKeyword };
}
