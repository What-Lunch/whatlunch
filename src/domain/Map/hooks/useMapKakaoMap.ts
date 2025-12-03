import { useRef, useCallback } from 'react';
import { DEFAULT_LOCATION, DEFAULT_MAP_LEVEL, CLUSTERER_MIN_LEVEL } from '@/shared/constants/map';

export function useMapKakaoMap(mapRef: React.RefObject<HTMLDivElement | null>) {
  const kakaoRef = useRef<typeof window.kakao | null>(null);

  const mapObjRef = useRef<kakao.maps.Map | null>(null);
  const clustererRef = useRef<kakao.maps.MarkerClusterer | null>(null);
  const userMarkerRef = useRef<kakao.maps.Marker | null>(null);
  const userLocationRef = useRef<{ lat: number; lng: number } | null>(null);

  const setKakao = useCallback(() => {
    if (typeof window !== 'undefined' && window.kakao) {
      kakaoRef.current = window.kakao;
    }
  }, []);

  const initMap = useCallback(
    (lat?: number, lng?: number) => {
      const kakao = kakaoRef.current;
      if (!kakao || !mapRef.current) return;

      const validLat = typeof lat === 'number' ? lat : DEFAULT_LOCATION.lat;
      const validLng = typeof lng === 'number' ? lng : DEFAULT_LOCATION.lng;

      const center = new kakao.maps.LatLng(validLat, validLng);

      userLocationRef.current = { lat: validLat, lng: validLng };

      if (mapObjRef.current) return;

      const map = new kakao.maps.Map(mapRef.current, {
        center,
        level: DEFAULT_MAP_LEVEL,
      });
      mapObjRef.current = map;

      userMarkerRef.current = new kakao.maps.Marker({
        position: center,
        map,
      });

      clustererRef.current = new kakao.maps.MarkerClusterer({
        map,
        averageCenter: false,
        minLevel: CLUSTERER_MIN_LEVEL,
      });
    },
    [mapRef]
  );

  return {
    kakaoRef,
    setKakao,
    mapObjRef,
    clustererRef,
    userMarkerRef,
    userLocationRef,
    initMap,
  };
}
