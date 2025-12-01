import { useRef, useCallback } from 'react';

const DEFAULT_LOCATION = { lat: 37.5656219, lng: 126.9770437 };

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

      // 재생성 방지
      if (mapObjRef.current) {
        mapObjRef.current.setCenter(center);
        if (userMarkerRef.current) {
          userMarkerRef.current.setPosition(center);
        }
        return;
      }

      const map = new kakao.maps.Map(mapRef.current, {
        center,
        level: 3,
      });
      mapObjRef.current = map;

      // 사용자 기준 마커
      userMarkerRef.current = new kakao.maps.Marker({
        position: center,
        map,
      });

      clustererRef.current = new kakao.maps.MarkerClusterer({
        map,
        averageCenter: false,
        minLevel: 7,
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
