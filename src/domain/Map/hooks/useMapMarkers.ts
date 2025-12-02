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

  const markerMapRef = useRef<Map<string, kakao.maps.Marker>>(new Map());

  const eventAttachedRef = useRef<Set<string>>(new Set());

  const createMarkers = (places: MapPlace[]) => {
    const kakao = kakaoRef.current;
    const map = mapObjRef.current;
    const clusterer = clustererRef.current;

    if (!kakao || !map || !clusterer) return;

    const nextIds = new Set(places.map(p => p.id));

    markerMapRef.current.forEach((marker, id) => {
      if (!nextIds.has(id)) {
        marker.setMap(null);
        markerMapRef.current.delete(id);
        eventAttachedRef.current.delete(id);
      }
    });

    const newMarkers: kakao.maps.Marker[] = [];

    places.forEach(place => {
      const { id, x, y } = place;

      let marker = markerMapRef.current.get(id);

      if (!marker) {
        const position = new kakao.maps.LatLng(Number(y), Number(x));

        marker = new kakao.maps.Marker({
          position,
        });

        markerMapRef.current.set(id, marker);

        if (!eventAttachedRef.current.has(id)) {
          eventAttachedRef.current.add(id);

          kakao.maps.event.addListener(marker, 'mouseover', () => {
            if (activeMarkerRef.current !== marker) {
              marker!.setImage(mapMarkerHoverIcon());
            }
          });

          kakao.maps.event.addListener(marker, 'mouseout', () => {
            if (activeMarkerRef.current !== marker) {
              marker!.setImage(null);
            }
          });

          kakao.maps.event.addListener(marker, 'click', () => {
            // 다른 활성 마커 초기화
            if (activeMarkerRef.current && activeMarkerRef.current !== marker) {
              activeMarkerRef.current.setImage(null);
            }

            marker!.setImage(mapMarkerActiveIcon());
            activeMarkerRef.current = marker!;

            setActiveId(id);
          });
        }
      }

      marker.setMap(map);

      newMarkers.push(marker);
    });

    clusterer.clear();
    clusterer.addMarkers(newMarkers);
  };

  const activateMarkerById = (id: string) => {
    const map = mapObjRef.current;
    const marker = markerMapRef.current.get(id);

    if (!map || !marker) return;

    // 기존 활성 마커 초기화
    if (activeMarkerRef.current && activeMarkerRef.current !== marker) {
      activeMarkerRef.current.setImage(null);
    }

    marker.setImage(mapMarkerActiveIcon());
    activeMarkerRef.current = marker;

    map.setCenter(marker.getPosition());
  };

  const resetMarkers = () => {
    const clusterer = clustererRef.current;
    if (!clusterer) return;

    clusterer.clear();

    markerMapRef.current.forEach(marker => marker.setMap(null));
    markerMapRef.current.clear();
    eventAttachedRef.current.clear();
    activeMarkerRef.current = null;
  };

  return { createMarkers, resetMarkers, activateMarkerById };
}
