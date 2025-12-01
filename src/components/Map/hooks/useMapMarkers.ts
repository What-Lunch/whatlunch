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

  const markerEventRef = useRef<Set<string>>(new Set());

  const createMarkers = (places: MapPlace[]) => {
    const kakao = kakaoRef.current;
    const map = mapObjRef.current;
    const clusterer = clustererRef.current;

    if (!kakao || !map || !clusterer) return;

    // 현재 존재하는 placeId 목록
    const nextIds = new Set(places.map(p => p.id));

    markerMapRef.current.forEach((marker, id) => {
      if (!nextIds.has(id)) {
        marker.setMap(null);
        markerMapRef.current.delete(id);
        markerEventRef.current.delete(id);
      }
    });

    const newMarkers: kakao.maps.Marker[] = [];

    places.forEach(place => {
      let marker = markerMapRef.current.get(place.id);

      if (marker) {
        newMarkers.push(marker);
        return;
      }

      const pos = new kakao.maps.LatLng(Number(place.y), Number(place.x));
      marker = new kakao.maps.Marker({ position: pos });

      markerMapRef.current.set(place.id, marker);
      newMarkers.push(marker);

      if (!markerEventRef.current.has(place.id)) {
        markerEventRef.current.add(place.id);

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
          if (activeMarkerRef.current && activeMarkerRef.current !== marker) {
            activeMarkerRef.current.setImage(null);
          }

          marker!.setImage(mapMarkerActiveIcon());
          activeMarkerRef.current = marker;

          setActiveId(place.id);
        });
      }
    });

    clusterer.clear();
    clusterer.addMarkers(newMarkers);
  };

  const activateMarkerById = (id: string) => {
    const map = mapObjRef.current;
    const marker = markerMapRef.current.get(id);

    if (!map || !marker) return;

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
    markerEventRef.current.clear();
    activeMarkerRef.current = null;
  };

  return { createMarkers, resetMarkers, activateMarkerById };
}
