'use client';

import { useCallback, useEffect, useState, useRef } from 'react';

import { KakaoMapProps } from './types';

const KAKAO_MAP = process.env.NEXT_PUBLIC_KAKAO_MAP_KEY;
const DEFAULT_MAP_LEVEL = 3;

export default function KakaoMap({ keyword }: KakaoMapProps) {
  const [places, setPlaces] = useState<Kakao.PlacesSearchResult>([]);
  const [mapReady, setMapReady] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [hasPermission, setHasPermission] = useState<boolean>(false);
  const searchMarkersRef = useRef<Kakao.Marker[]>([]);
  const mapRef = useRef<Kakao.Maps | null>(null);
  const mapContainerRef = useRef<HTMLDivElement | null>(null);

  // 위치 생성 시 지도 및 마커 설정
  const positionGenerated = useCallback(
    (latitude: number, longitude: number, permission: boolean) => {
      const option = {
        center: new window.kakao.maps.LatLng(latitude, longitude),
        level: DEFAULT_MAP_LEVEL,
      };
      // 현재 내 위치 마커 표시
      const mapInstance = new window.kakao.maps.Map(mapContainerRef.current, option);
      mapRef.current = mapInstance;
      const markerPosition = new window.kakao.maps.LatLng(latitude, longitude);
      const marker = new window.kakao.maps.Marker({
        position: markerPosition,
      });
      marker.setMap(mapInstance);
      setMapReady(true);
      setHasPermission(permission);
    },
    []
  );

  useEffect(() => {
    const scriptSrc = `//dapi.kakao.com/v2/maps/sdk.js?appkey=${KAKAO_MAP}&autoload=false&libraries=services`;
    const existingScript = document.querySelector(`script[src="${scriptSrc}"]`);

    const initialMap = () => {
      if (!window.kakao || !window.kakao.maps) return;
      window.kakao.maps.load(() => {
        navigator.geolocation.getCurrentPosition(
          // 현재 위치 가져오기 -> 위치 수락 필요
          position => {
            const { latitude, longitude } = position.coords;
            positionGenerated(latitude, longitude, true);
          },
          () => {
            // 위치 거부 시 기본 위치(서울 시청)로 설정
            positionGenerated(37.5665, 126.978, false);
          }
        );
      });
    };

    if (existingScript) {
      if (window.kakao && window.kakao.maps) {
        initialMap();
      } else {
        existingScript.addEventListener('load', initialMap);
      }
      return;
    }

    const script = document.createElement('script');
    script.src = scriptSrc;
    script.async = true;
    script.onload = () => {
      initialMap();
    };
    script.onerror = () => {
      setError('카카오 지도 로드에 실패했습니다.');
    };
    document.head.appendChild(script);

    return () => {
      setPlaces([]);
      setMapReady(false);
    };
  }, [positionGenerated]);

  // 검색어 변경 시 장소 검색
  useEffect(() => {
    if (!mapReady || !mapRef.current || !window.kakao?.maps?.services) return;

    const debounceTimer = setTimeout(() => {
      searchMarkersRef.current.forEach(marker => marker.setMap(null));
      searchMarkersRef.current = [];

      if (keyword && keyword.trim() !== '') {
        const ps = new window.kakao.maps.services.Places();

        // 위치권한 있을 때는 주변 검색 후 전국 검색, 없을 때는 바로 전국 검색
        if (!!hasPermission) {
          ps.keywordSearch(
            keyword,
            (data: Kakao.PlacesSearchResult, status: Kakao.Status) => {
              if (status === window.kakao.maps.services.Status.OK && data.length > 0) {
                // 주변에 결과 있음 → 바로 표시
                setPlaces(data);
                const newMarkers: Kakao.Marker[] = [];
                data.forEach(place => {
                  const markerPosition = new window.kakao.maps.LatLng(
                    Number(place.y),
                    Number(place.x)
                  );
                  const marker = new window.kakao.maps.Marker({
                    position: markerPosition,
                    map: mapRef.current,
                  });
                  newMarkers.push(marker);
                });
                searchMarkersRef.current = newMarkers;
              } else {
                // 주변에 결과 없음 → 전국 검색
                ps.keywordSearch(
                  keyword,
                  (data2: Kakao.PlacesSearchResult, status2: Kakao.Status) => {
                    if (status2 === window.kakao.maps.services.Status.OK && data2.length > 0) {
                      const first = data2[0];
                      const center = new window.kakao.maps.LatLng(Number(first.y), Number(first.x));
                      if (mapRef.current) {
                        mapRef.current.setCenter(center);
                      }

                      ps.keywordSearch(
                        keyword,
                        (data3: Kakao.PlacesSearchResult, status3: Kakao.Status) => {
                          if (status3 === window.kakao.maps.services.Status.OK) {
                            setPlaces(data3);
                            const newMarkers: Kakao.Marker[] = [];
                            data3.forEach(place => {
                              const markerPosition = new window.kakao.maps.LatLng(
                                Number(place.y),
                                Number(place.x)
                              );
                              const marker = new window.kakao.maps.Marker({
                                position: markerPosition,
                                map: mapRef.current,
                              });
                              newMarkers.push(marker);
                            });
                            searchMarkersRef.current = newMarkers;
                          } else {
                            setPlaces([]);
                          }
                        },
                        { location: center, radius: 3000 }
                      );
                    } else {
                      setPlaces([]);
                    }
                  }
                );
              }
            },
            { location: mapRef?.current?.getCenter(), radius: 3000 }
          );
        } else {
          // 위치권한 없음 → 바로 전국 검색
          ps.keywordSearch(keyword, (data: Kakao.PlacesSearchResult, status: Kakao.Status) => {
            if (status === window.kakao.maps.services.Status.OK && data.length > 0) {
              const first = data[0];
              const center = new window.kakao.maps.LatLng(Number(first.y), Number(first.x));
              if (mapRef.current) {
                mapRef.current.setCenter(center);
              }

              ps.keywordSearch(
                keyword,
                (data2: Kakao.PlacesSearchResult, status2: Kakao.Status) => {
                  if (status2 === window.kakao.maps.services.Status.OK) {
                    setPlaces(data2);
                    const newMarkers: Kakao.Marker[] = [];
                    data2.forEach(place => {
                      const markerPosition = new window.kakao.maps.LatLng(
                        Number(place.y),
                        Number(place.x)
                      );
                      const marker = new window.kakao.maps.Marker({
                        position: markerPosition,
                        map: mapRef.current,
                      });
                      newMarkers.push(marker);
                    });
                    searchMarkersRef.current = newMarkers;
                  } else {
                    setPlaces([]);
                  }
                },
                { location: center, radius: 3000 }
              );
            } else {
              setPlaces([]);
            }
          });
        }
      } else {
        setPlaces([]);
      }
    }, 300);

    return () => clearTimeout(debounceTimer);
  }, [keyword, mapReady, hasPermission]);
  // 장소 클릭 시 해당 위치로 지도 중심 이동
  const handlePlaceClick = useCallback((place: Kakao.PlaceItem) => {
    if (mapRef.current) {
      const latling = new window.kakao.maps.LatLng(Number(place.y), Number(place.x));
      mapRef.current.setCenter(latling);
      mapRef.current.setLevel(DEFAULT_MAP_LEVEL);
    }
  }, []);

  return (
    <div style={{ width: '100%', height: '100%' }}>
      {error && <div style={{ color: 'red', padding: '8px' }}>{error}</div>}
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
          <ul>
            {places.map(place => (
              <li
                key={place.id}
                style={{ padding: '8px 0', borderBottom: '1px solid #eee', cursor: 'pointer' }}
                onClick={() => handlePlaceClick(place)}
              >
                <strong>{place.place_name}</strong>
                <br />
                {place.road_address_name || place.address_name}
                <br />
                {place.phone}
              </li>
            ))}
          </ul>
        ) : (
          <div style={{ padding: '12px', color: '#888' }}>검색 결과가 없습니다.</div>
        )}
      </div>
    </div>
  );
}
