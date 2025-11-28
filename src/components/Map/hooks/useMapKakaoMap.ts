import { useRef, useCallback } from 'react';

export function useMapKakaoMap(mapRef: React.RefObject<HTMLDivElement | null>) {
  const kakaoRef = useRef<typeof window.kakao>(window.kakao);

  const mapObjRef = useRef<kakao.maps.Map | null>(null);
  const clustererRef = useRef<kakao.maps.MarkerClusterer | null>(null);
  const userMarkerRef = useRef<kakao.maps.Marker | null>(null);
  const userLocationRef = useRef<{ lat: number; lng: number } | null>(null);

  const initMap = useCallback(
    (lat: number, lng: number) => {
      const kakao = kakaoRef.current;

      if (!kakao) {
        console.warn('[initMap] kakao SDK not loaded');
        return;
      }
      if (!mapRef.current) {
        console.warn('[initMap] map container not found');
        return;
      }

      const center = new kakao.maps.LatLng(lat, lng);

      userLocationRef.current = { lat, lng };

      // 기존 객체 초기화
      mapObjRef.current = null;

      const map = new kakao.maps.Map(mapRef.current, {
        center,
        level: 4,
      });

      mapObjRef.current = map;

      if (userMarkerRef.current) {
        userMarkerRef.current.setMap(null);
      }

      userMarkerRef.current = new kakao.maps.Marker({
        position: center,
        map,
      });

      if (clustererRef.current) {
        clustererRef.current.clear();
      }

      clustererRef.current = new kakao.maps.MarkerClusterer({
        map,
        averageCenter: true,
        minLevel: 7,
      });
    },
    [mapRef]
  );

  return {
    kakaoRef,
    mapObjRef,
    clustererRef,
    userMarkerRef,
    userLocationRef,
    initMap,
  };
}
