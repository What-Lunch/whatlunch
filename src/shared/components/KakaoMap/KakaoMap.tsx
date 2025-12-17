'use client';

import { useCallback, useEffect, useState, useRef } from 'react';

import { KakaoMapProps } from './types';

const KAKAO_MAP = process.env.NEXT_PUBLIC_KAKAO_MAP_KEY;
const DEFAULT_MAP_LEVEL = 3;
const SEARCH_RADIUS = 3000;
const DEBOUNCE_DELAY = 300;
const DEFAULT_COORDS = { lat: 37.5665, lng: 126.978 }; // 서울시청

export default function KakaoMap({ keyword }: KakaoMapProps) {
  const [places, setPlaces] = useState<Kakao.PlacesSearchResult>([]);
  const [mapReady, setMapReady] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [hasPermission, setHasPermission] = useState<boolean>(false);

  const searchMarkersRef = useRef<Kakao.Marker[]>([]);
  const mapRef = useRef<Kakao.Maps | null>(null);
  const mapContainerRef = useRef<HTMLDivElement | null>(null);
  const currentLocationMarkerRef = useRef<Kakao.Marker | null>(null);

  /**
   * 검색 마커 초기화
   */
  const clearSearchMarkers = useCallback(() => {
    searchMarkersRef.current.forEach(marker => marker.setMap(null));
    searchMarkersRef.current = [];
  }, []);

  /**
   * 검색 결과 표시
   */
  const displaySearchResults = useCallback((data: Kakao.PlacesSearchResult) => {
    setPlaces(data);

    const newMarkers = data.map(place => {
      const position = new window.kakao.maps.LatLng(Number(place.y), Number(place.x));
      const marker = new window.kakao.maps.Marker({
        position,
        map: mapRef.current,
      });
      return marker;
    });

    searchMarkersRef.current = newMarkers;
  }, []);

  /**
   * 전국 검색 후 지도 중심 이동 및 주변 검색
   */
  const searchNationwide = useCallback(
    (ps: any, searchKeyword: string) => {
      ps.keywordSearch(searchKeyword, (data: Kakao.PlacesSearchResult, status: Kakao.Status) => {
        if (status === window.kakao.maps.services.Status.OK && data.length > 0) {
          const firstPlace = data[0];
          const newCenter = new window.kakao.maps.LatLng(
            Number(firstPlace.y),
            Number(firstPlace.x)
          );

          // 지도 중심 이동
          if (mapRef.current) {
            mapRef.current.setCenter(newCenter);
          }

          // 새로운 중심 기준 주변 검색
          ps.keywordSearch(
            searchKeyword,
            (nearbyData: Kakao.PlacesSearchResult, nearbyStatus: Kakao.Status) => {
              if (nearbyStatus === window.kakao.maps.services.Status.OK) {
                displaySearchResults(nearbyData);
              } else {
                setPlaces([]);
              }
            },
            { location: newCenter, radius: SEARCH_RADIUS }
          );
        } else {
          setPlaces([]);
        }
      });
    },
    [displaySearchResults]
  );

  /**
   * 주변 검색 (위치 권한 있을 때)
   */
  const searchNearby = useCallback(
    (ps: any, searchKeyword: string) => {
      const center = mapRef.current?.getCenter();
      if (!center) return;

      ps.keywordSearch(
        searchKeyword,
        (data: Kakao.PlacesSearchResult, status: Kakao.Status) => {
          if (status === window.kakao.maps.services.Status.OK && data.length > 0) {
            // 주변에 결과 있음
            displaySearchResults(data);
          } else if (data.length === 0) {
            // 주변에 결과 없음 → 전국 검색
            searchNationwide(ps, searchKeyword);
          } else {
            setPlaces([]);
          }
        },
        { location: center, radius: SEARCH_RADIUS }
      );
    },
    [displaySearchResults, searchNationwide]
  );

  /**
   * 키워드 검색 실행
   */
  const executeSearch = useCallback(
    (searchKeyword: string) => {
      if (!mapRef.current || !window.kakao?.maps?.services) return;

      clearSearchMarkers();

      if (!searchKeyword || !searchKeyword.trim()) {
        setPlaces([]);
        return;
      }

      const ps = new window.kakao.maps.services.Places();

      if (hasPermission) {
        searchNearby(ps, searchKeyword);
      } else {
        searchNationwide(ps, searchKeyword);
      }
    },
    [hasPermission, clearSearchMarkers, searchNearby, searchNationwide]
  );

  /**
   * 지도 초기화 (한 번만 실행)
   */
  const initializeMap = useCallback((latitude: number, longitude: number, permission: boolean) => {
    // 이미 지도가 초기화되어 있으면 실행하지 않음
    if (mapRef.current) return;

    const center = new window.kakao.maps.LatLng(latitude, longitude);
    const mapInstance = new window.kakao.maps.Map(mapContainerRef.current, {
      center,
      level: DEFAULT_MAP_LEVEL,
    });

    mapRef.current = mapInstance;

    // 현재 위치 마커 표시
    const locationMarker = new window.kakao.maps.Marker({
      position: center,
      map: mapInstance,
    });
    currentLocationMarkerRef.current = locationMarker;

    setMapReady(true);
    setHasPermission(permission);
  }, []);

  /**
   * 카카오맵 스크립트 로드
   */
  useEffect(() => {
    const scriptSrc = `//dapi.kakao.com/v2/maps/sdk.js?appkey=${KAKAO_MAP}&autoload=false&libraries=services`;
    const existingScript = document.querySelector(`script[src="${scriptSrc}"]`);

    const loadMap = () => {
      if (!window.kakao?.maps) return;

      window.kakao.maps.load(() => {
        navigator.geolocation.getCurrentPosition(
          position => {
            const { latitude, longitude } = position.coords;
            initializeMap(latitude, longitude, true);
          },
          () => {
            // 위치 거부 시 기본 위치
            initializeMap(DEFAULT_COORDS.lat, DEFAULT_COORDS.lng, false);
          }
        );
      });
    };

    if (existingScript) {
      if (window.kakao?.maps) {
        loadMap();
      } else {
        existingScript.addEventListener('load', loadMap);
      }
      return;
    }

    const script = document.createElement('script');
    script.src = scriptSrc;
    script.async = true;
    script.onload = loadMap;
    script.onerror = () => {
      setError('카카오 지도를 불러오는데 실패했습니다.');
    };
    document.head.appendChild(script);

    return () => {
      clearSearchMarkers();
      if (currentLocationMarkerRef.current) {
        currentLocationMarkerRef.current.setMap(null);
      }
    };
  }, [initializeMap, clearSearchMarkers]);

  /**
   * 검색어 변경 감지 (디바운스)
   */
  useEffect(() => {
    if (!mapReady) return;

    const debounceTimer = setTimeout(() => {
      executeSearch(keyword || '');
    }, DEBOUNCE_DELAY);

    return () => clearTimeout(debounceTimer);
  }, [keyword, mapReady, executeSearch]);

  /**
   * 장소 클릭 핸들러
   */
  const handlePlaceClick = useCallback((place: Kakao.PlaceItem) => {
    if (!mapRef.current) return;

    const position = new window.kakao.maps.LatLng(Number(place.y), Number(place.x));
    mapRef.current.setCenter(position);
    mapRef.current.setLevel(DEFAULT_MAP_LEVEL);
  }, []);

  return (
    <div style={{ width: '100%', height: '100%' }}>
      {error && (
        <div
          style={{
            color: '#fff',
            background: '#f44336',
            padding: '12px',
            borderRadius: '4px',
            marginBottom: '8px',
          }}
        >
          {error}
        </div>
      )}

      <div ref={mapContainerRef} style={{ width: '100%', height: '70%' }} />

      <div
        style={{
          height: '30%',
          overflowY: 'auto',
          background: '#fff',
          borderTop: '1px solid #eee',
        }}
      >
        {places.length > 0 ? (
          <ul style={{ listStyle: 'none', margin: 0, padding: 0 }}>
            {places.map(place => (
              <li
                key={place.id}
                style={{
                  padding: '12px 16px',
                  borderBottom: '1px solid #eee',
                  cursor: 'pointer',
                  transition: 'background 0.2s',
                }}
                onClick={() => handlePlaceClick(place)}
                onMouseEnter={e => {
                  e.currentTarget.style.background = '#f5f5f5';
                }}
                onMouseLeave={e => {
                  e.currentTarget.style.background = 'transparent';
                }}
              >
                <strong style={{ fontSize: '14px', color: '#333' }}>{place.place_name}</strong>
                <div style={{ fontSize: '12px', color: '#666', marginTop: '4px' }}>
                  {place.road_address_name || place.address_name}
                </div>
                {place.phone && (
                  <div style={{ fontSize: '12px', color: '#999', marginTop: '2px' }}>
                    {place.phone}
                  </div>
                )}
              </li>
            ))}
          </ul>
        ) : (
          <div
            style={{
              padding: '24px',
              color: '#999',
              textAlign: 'center',
              fontSize: '14px',
            }}
          >
            {keyword ? '검색 결과가 없습니다.' : '검색어를 입력하세요.'}
          </div>
        )}
      </div>
    </div>
  );
}
