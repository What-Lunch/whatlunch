import { MutableRefObject, useCallback, useRef } from 'react';

import { MapPlace } from '../type';

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

      // 캐싱된 결과가 있으면 즉시 반환
      if (categoryCacheRef.current.has(cacheKey)) {
        const cached = categoryCacheRef.current.get(cacheKey)!;
        setPlaces(cached);
        createMarkers(cached);

        setTimeout(() => {
          map.setCenter(new kakao.maps.LatLng(lat, lng));
          map.setLevel(4);
        }, 0);

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
        radius: 5000,
      };

      ps.categorySearch(
        categoryCode,
        (data: MapPlace[], status: kakao.maps.services.Status) => {
          const { Status } = kakao.maps.services;

          if (status === Status.OK) {
            // 캐싱 저장
            categoryCacheRef.current.set(cacheKey, data);

            lastCategoryRef.current = categoryCode;
            lastLocationRef.current = { lat, lng };

            setPlaces(data);
            createMarkers(data);

            setTimeout(() => {
              map.setCenter(new kakao.maps.LatLng(lat, lng));
              map.setLevel(4);
            }, 0);
          } else if (status === 'ZERO_RESULT') {
            categoryCacheRef.current.set(cacheKey, []);
            setPlaces([]);
            createMarkers([]);

            lastCategoryRef.current = categoryCode;
            lastLocationRef.current = { lat, lng };
          } else {
            setPlaces([]);
            createMarkers([]);
          }
        },
        options
      );
    },
    [kakaoRef, mapObjRef, userLocationRef, createMarkers]
  );

  return { searchCategory };
}
