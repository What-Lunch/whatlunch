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

      ps.keywordSearch(text, (data: any[], status: string) => {
        const { Status } = kakao.maps.services;

        if (status === Status.OK) {
          const places = data as MapPlace[];

          setPlaces(places);
          createMarkers(places);

          // 첫 결과 중심으로 이동
          if (places.length > 0) {
            map.setCenter(new kakao.maps.LatLng(Number(places[0].y), Number(places[0].x)));
          }
          return;
        }

        // 결과 없음
        if (status === 'ZERO_RESULT') {
          setPlaces([]);
          createMarkers([]);
          return;
        }

        // 기타 오류
        console.warn('[Kakao Places] Keyword search failed:', status);
        setPlaces([]);
        createMarkers([]);
      });
    },
    [kakaoRef, mapObjRef, createMarkers]
  );

  return { searchKeyword };
}
