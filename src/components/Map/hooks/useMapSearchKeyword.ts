import { MutableRefObject, useCallback, useRef } from 'react';
import { MapPlace } from '../type';
import { resetMapView } from '../utils/resetMapView';
import { handleZeroResult } from '../utils/handleZeroResult';

const SEARCH_RADIUS = 5000;
const MIN_QUERY = 2;
const MAP_DEFAULT_LEVEL = 4;

export function useMapSearchKeyword(
  kakaoRef: MutableRefObject<typeof window.kakao | null>,
  mapObjRef: MutableRefObject<kakao.maps.Map | null>,
  userLocationRef: MutableRefObject<{ lat: number; lng: number } | null>,
  updateMarkers: (places: MapPlace[]) => void
) {
  const psRef = useRef<kakao.maps.services.Places | null>(null);

  // 이전 검색 상태
  const lastKeywordRef = useRef('');
  const lastFirstIdRef = useRef<string | null>(null);

  const searchKeyword = useCallback(
    (keyword: string, setPlaces: (p: MapPlace[]) => void) => {
      const kakao = kakaoRef.current;
      const map = mapObjRef.current;
      const user = userLocationRef.current;

      if (!kakao || !map || !user) return;

      const q = keyword.trim();
      if (q.length < MIN_QUERY) {
        handleZeroResult(setPlaces, updateMarkers);
        return;
      }

      // 동일 키워드 검색 방지
      if (q === lastKeywordRef.current) return;
      lastKeywordRef.current = q;

      // Places 인스턴스 생성
      if (!psRef.current) {
        psRef.current = new kakao.maps.services.Places();
      }

      const opt = {
        location: new kakao.maps.LatLng(user.lat, user.lng),
        radius: SEARCH_RADIUS,
      };

      const { Status } = kakao.maps.services;

      psRef.current.keywordSearch(
        q,
        (data, status) => {
          if (status !== Status.OK) {
            lastFirstIdRef.current = null;
            handleZeroResult(setPlaces, updateMarkers);
            return;
          }

          const firstId = data[0]?.id ?? null;
          if (firstId && firstId === lastFirstIdRef.current) {
            return;
          }

          lastFirstIdRef.current = firstId;

          setPlaces(data);

          queueMicrotask(() => updateMarkers(data));

          const first = data[0];
          if (first) {
            requestAnimationFrame(() => {
              resetMapView(map, kakao, Number(first.y), Number(first.x), MAP_DEFAULT_LEVEL);
            });
          }
        },
        opt
      );
    },
    [kakaoRef, mapObjRef, userLocationRef, updateMarkers]
  );

  return { searchKeyword };
}
