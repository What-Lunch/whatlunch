'use client';

import { useCallback, useEffect, useState, useRef } from 'react';
import styles from './KakaoMap.module.scss';
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

  const searchMarkersRef = useRef<Kakao.maps.Marker[]>([]);
  const mapRef = useRef<Kakao.maps.Map | null>(null);
  const mapContainerRef = useRef<HTMLDivElement | null>(null);
  const currentLocationMarkerRef = useRef<Kakao.maps.Marker | null>(null);
  const infoWindowRef = useRef<Kakao.maps.InfoWindow | null>(null);

  /**
   * InfoWindow 초기화 (한 번만)
   */
  const initializeInfoWindow = useCallback(() => {
    if (!infoWindowRef.current && window.kakao?.maps) {
      infoWindowRef.current = new window.kakao.maps.InfoWindow({
        removable: true,
      });
    }
  }, []);

  /**
   * 검색 마커 초기화
   */
  const clearSearchMarkers = useCallback(() => {
    searchMarkersRef.current.forEach(marker => marker.setMap(null));
    searchMarkersRef.current = [];

    // InfoWindow도 닫기
    if (infoWindowRef.current) {
      infoWindowRef.current.close();
    }
  }, []);

  /**
   * InfoWindow 내용 생성
   */
  const createInfoWindowContent = useCallback((place: Kakao.PlaceItem) => {
    return `
      <div style="padding: 12px; min-width: 200px;">
        <h4 style="margin: 0 0 8px 0; font-size: 14px; font-weight: bold; color: #333;">
          ${place.place_name}
        </h4>
        <p style="margin: 4px 0; font-size: 12px; color: #666;">
          ${place.road_address_name || place.address_name}
        </p>
        ${
          place.phone
            ? `<p style="margin: 4px 0; font-size: 12px; color: #999;">
                ${place.phone}
              </p>`
            : ''
        }
      </div>
    `;
  }, []);

  /**
   * 검색 결과 표시 (마커 클릭 시 InfoWindow 표시)
   */
  const displaySearchResults = useCallback(
    (data: Kakao.PlacesSearchResult) => {
      setPlaces(data);

      const newMarkers = data.map(place => {
        const position = new window.kakao.maps.LatLng(Number(place.y), Number(place.x));
        const marker = new window.kakao.maps.Marker({
          position,
          map: mapRef.current,
        });

        // 마커 클릭 이벤트: InfoWindow 재사용
        window.kakao.maps.event.addListener(marker, 'click', () => {
          if (infoWindowRef.current && mapRef.current) {
            const content = createInfoWindowContent(place);
            infoWindowRef.current.setContent(content);
            infoWindowRef.current.open(mapRef.current, marker);
          }
        });

        return marker;
      });

      searchMarkersRef.current = newMarkers;
    },
    [createInfoWindowContent]
  );

  /**
   * 전국 검색 후 지도 중심 이동 및 주변 검색
   */
  const searchNationwide = useCallback(
    (ps: Kakao.maps.services.Places, searchKeyword: string) => {
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
    (ps: Kakao.maps.services.Places, searchKeyword: string) => {
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
  const initializeMap = useCallback(
    (latitude: number, longitude: number, permission: boolean) => {
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

      // InfoWindow 초기화
      initializeInfoWindow();

      setMapReady(true);
      setHasPermission(permission);
    },
    [initializeInfoWindow]
  );

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
      // cleanup: 마커들만 제거하고 지도 인스턴스는 유지
      clearSearchMarkers();
      if (currentLocationMarkerRef.current) {
        currentLocationMarkerRef.current.setMap(null);
      }
      if (infoWindowRef.current) {
        infoWindowRef.current.close();
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
   * 장소 클릭 핸들러 (리스트 아이템)
   */
  const handlePlaceClick = useCallback(
    (place: Kakao.PlaceItem) => {
      if (!mapRef.current) return;

      const position = new window.kakao.maps.LatLng(Number(place.y), Number(place.x));
      mapRef.current.setCenter(position);
      mapRef.current.setLevel(DEFAULT_MAP_LEVEL);

      // 해당 장소의 마커를 찾아서 InfoWindow 표시
      const targetMarker = searchMarkersRef.current.find(marker => {
        const markerPos = marker.getPosition();
        return markerPos.getLat() === Number(place.y) && markerPos.getLng() === Number(place.x);
      });

      if (targetMarker && infoWindowRef.current) {
        const content = createInfoWindowContent(place);
        infoWindowRef.current.setContent(content);
        infoWindowRef.current.open(mapRef.current, targetMarker);
      }
    },
    [createInfoWindowContent]
  );

  return (
    <div className={styles['map-wrapper']}>
      {error && <div className={styles['error-message']}>{error}</div>}
      <div ref={mapContainerRef} className={styles['map']} />

      <div className={styles['map__place-list']}>
        {places.length > 0 ? (
          <ul className={styles['map__place-list__list']}>
            {places.map(place => (
              <li
                key={place.id}
                className={styles['map__place-list__list__item']}
                onClick={() => handlePlaceClick(place)}
              >
                <span className={styles['map__place-list__list__item__name']}>
                  {place.place_name}
                </span>
                <div className={styles['map__place-list__list__item__address']}>
                  {place.road_address_name || place.address_name}
                </div>
                {place.phone && (
                  <div className={styles['map__place-list__list__item__phone']}>{place.phone}</div>
                )}
              </li>
            ))}
          </ul>
        ) : (
          <div className={styles['map__place-list__search-prompt']}>
            {keyword ? '검색 결과가 없습니다.' : '검색어를 입력하세요.'}
          </div>
        )}
      </div>
    </div>
  );
}
