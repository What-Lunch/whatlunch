import { MutableRefObject, useCallback, useRef } from 'react';

import { MapPlace } from '../type';

export function useMapSearchKeyword(
  kakaoRef: MutableRefObject<typeof window.kakao | null>,
  mapObjRef: MutableRefObject<kakao.maps.Map | null>,
  userLocationRef: MutableRefObject<{ lat: number; lng: number } | null>,
  createMarkers: (places: MapPlace[]) => void
) {
  const lastKeywordRef = useRef<string>('');
  const lastResultRef = useRef<MapPlace[] | null>(null);
  const debounceRef = useRef<NodeJS.Timeout | null>(null);

  const psRef = useRef<kakao.maps.services.Places | null>(null);

  const searchKeyword = useCallback(
    (keyword: string, setPlaces: (places: MapPlace[]) => void) => {
      const kakao = kakaoRef.current;
      const map = mapObjRef.current;
      const userLoc = userLocationRef.current;

      if (!kakao || !map || !userLoc) return;

      const { lat, lng } = userLoc;

      const normalized = keyword.trim();
      if (normalized.length < 2) {
        setPlaces([]);
        createMarkers([]);
        return;
      }

      if (lastKeywordRef.current === normalized) return;

      if (debounceRef.current) clearTimeout(debounceRef.current);

      debounceRef.current = setTimeout(() => {
        if (!psRef.current) {
          psRef.current = new kakao.maps.services.Places();
        }

        const options = {
          location: new kakao.maps.LatLng(lat, lng),
          radius: 5000,
        };

        psRef.current.keywordSearch(
          normalized,
          (data: MapPlace[], status: kakao.maps.services.Status) => {
            const { Status } = kakao.maps.services;

            if (status === Status.OK) {
              if (JSON.stringify(data) === JSON.stringify(lastResultRef.current)) {
                return;
              }

              lastKeywordRef.current = normalized;
              lastResultRef.current = data;

              setPlaces(data);
              createMarkers(data);

              setTimeout(() => {
                map.setCenter(new kakao.maps.LatLng(lat, lng));
                map.setLevel(4);
              }, 0);
            } else if (status === 'ZERO_RESULT') {
              setPlaces([]);
              createMarkers([]);

              lastResultRef.current = [];
              lastKeywordRef.current = normalized;
            } else {
              setPlaces([]);
              createMarkers([]);
            }
          },
          options
        );
      }, 300);
    },

    [kakaoRef, mapObjRef, userLocationRef, createMarkers]
  );

  return { searchKeyword };
}
