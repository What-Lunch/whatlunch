import { useRef } from 'react';

import { mapMarkerHoverIcon, mapMarkerActiveIcon } from '../utils/mapMarkerIcons';

import { MapPlace } from '../type';

export function useMapMarkers(
  kakaoRef: React.MutableRefObject<typeof window.kakao | null>,
  mapObjRef: React.MutableRefObject<kakao.maps.Map | null>,
  clustererRef: React.MutableRefObject<kakao.maps.MarkerClusterer | null>,
  setActiveId: (id: string | null) => void
) {
  const activeMarkerRef = useRef<kakao.maps.Marker | null>(null);

  const createMarkers = (places: MapPlace[]) => {
    const kakao = kakaoRef.current as typeof window.kakao;
    const map = mapObjRef.current;
    const clusterer = clustererRef.current;

    if (!kakao || !map || !clusterer) return;

    clusterer.clear();
    activeMarkerRef.current = null;

    const markers = places.map(place => {
      const pos = new kakao.maps.LatLng(Number(place.y), Number(place.x));

      const marker = new kakao.maps.Marker({
        position: pos,
      });

      kakao.maps.event.addListener(marker, 'mouseover', () => {
        if (activeMarkerRef.current === marker) return;
        marker.setImage(mapMarkerHoverIcon());
      });

      kakao.maps.event.addListener(marker, 'mouseout', () => {
        if (activeMarkerRef.current === marker) return;
        marker.setImage(null);
      });

      kakao.maps.event.addListener(marker, 'click', () => {
        if (activeMarkerRef.current && activeMarkerRef.current !== marker) {
          activeMarkerRef.current.setImage(null);
        }

        marker.setImage(mapMarkerActiveIcon());
        activeMarkerRef.current = marker;

        // 리스트 활성화는 클릭에서만 반영
        setActiveId(place.id);
      });

      return marker;
    });

    clusterer.addMarkers(markers);
  };

  const resetMarkers = () => {
    const clusterer = clustererRef.current;
    if (!clusterer) return;

    clusterer.clear();
    activeMarkerRef.current?.setImage(null);
    activeMarkerRef.current = null;
  };

  return { createMarkers, resetMarkers };
}
