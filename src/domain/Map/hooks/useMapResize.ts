import { useEffect } from 'react';

export function useMapResize(
  mapRef: React.RefObject<HTMLDivElement | null>,
  mapObjRef: React.MutableRefObject<kakao.maps.Map | null>
) {
  useEffect(() => {
    if (!mapRef.current) return;
    if (!mapObjRef.current) return;

    const map = mapObjRef.current;

    // 현재 중심 유지용
    const handleResize = () => {
      const center = map.getCenter();
      map.relayout();
      map.setCenter(center);
    };

    const observer = new ResizeObserver(() => {
      handleResize();
    });

    observer.observe(mapRef.current);

    return () => observer.disconnect();
  }, [mapRef, mapObjRef]);
}
