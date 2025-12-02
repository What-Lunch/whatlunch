import { MutableRefObject, useCallback, useRef } from 'react';

import { resetMapView } from '../utils/resetMapView';
import { handleZeroResult } from '../utils/handleZeroResult';

import { MapPlace } from '../type';

const MAP_SEARCH_RADIUS = 5000;
const MAP_DEFAULT_LEVEL = 4;

export function useMapSearchCategory(
  kakaoRef: MutableRefObject<typeof window.kakao | null>,
  mapObjRef: MutableRefObject<kakao.maps.Map | null>,
  userLocationRef: MutableRefObject<{ lat: number; lng: number } | null>,
  createMarkers: (places: MapPlace[]) => void
) {
  const categoryCacheRef = useRef<Map<string, MapPlace[]>>(new Map());
  const lastCategoryRef = useRef<string | null>(null);
  const lastLocationRef = useRef<{ lat: number; lng: number } | null>(null);

  const searchCategory = useCallback(
    (categoryCode: string, setPlaces: (data: MapPlace[]) => void) => {
      const kakao = kakaoRef.current;
      const map = mapObjRef.current;
      const userLoc = userLocationRef.current;

      if (!kakao || !map || !userLoc) return;

      const { lat, lng } = userLoc;

      const cacheKey = `${categoryCode}-${lat}-${lng}`;
      const { Status } = kakao.maps.services;

      // 캐싱된 결과가 있으면 즉시 반환
      if (categoryCacheRef.current.has(cacheKey)) {
        const cached = categoryCacheRef.current.get(cacheKey)!;
        setPlaces(cached);
        createMarkers(cached);

        resetMapView(map, kakao, lat, lng, MAP_DEFAULT_LEVEL);
        return;
      }

      // 동일 카테고리, 위치 API 호출 방지
      if (
        lastCategoryRef.current === categoryCode &&
        lastLocationRef.current &&
        lastLocationRef.current.lat === lat &&
        lastLocationRef.current.lng === lng
      ) {
        return;
      }

      const ps = new kakao.maps.services.Places();
      const options = {
        location: new kakao.maps.LatLng(lat, lng),
        radius: MAP_SEARCH_RADIUS,
      };

      ps.categorySearch(
        categoryCode,
        (data: MapPlace[], status: kakao.maps.services.Status) => {
          if (status === Status.OK) {
            // 캐싱 저장
            categoryCacheRef.current.set(cacheKey, data);

            lastCategoryRef.current = categoryCode;
            lastLocationRef.current = { lat, lng };

            setPlaces(data);
            createMarkers(data);

            resetMapView(map, kakao, lat, lng, MAP_DEFAULT_LEVEL);
          } else if (status === Status.ZERO_RESULT) {
            categoryCacheRef.current.set(cacheKey, []);

            handleZeroResult(setPlaces, createMarkers);

            lastCategoryRef.current = categoryCode;
            lastLocationRef.current = { lat, lng };
          } else {
            handleZeroResult(setPlaces, createMarkers);
          }
        },
        options
      );
    },
    [kakaoRef, mapObjRef, userLocationRef, createMarkers]
  );

  return { searchCategory };
}
