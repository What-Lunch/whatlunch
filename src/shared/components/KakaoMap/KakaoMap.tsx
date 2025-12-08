'use client';
import { useCallback, useEffect, useState, useRef } from 'react';
import { placeSearchCallback } from './kakaoPlaceSearchCallback';
interface KakaoMapProps {
  value: string;
}

export default function KakaoMap({ value }: KakaoMapProps) {
  const KAKAOMAP = process.env.NEXT_PUBLIC_KAKAO_MAP_KEY;
  const [places, setPlaces] = useState<Kakao.PlacesSearchResult>([]);
  const mapRef = useRef<Kakao.Maps | null>(null);

  useEffect(() => {
    const script = document.createElement('script');
    script.src = `//dapi.kakao.com/v2/maps/sdk.js?appkey=${KAKAOMAP}&autoload=false&libraries=services`;

    script.onload = () => {
      window.kakao.maps.load(() => {
        navigator.geolocation.getCurrentPosition(
          // 현재 위치 가져오기 -> 위치 수락 필요
          position => {
            const { latitude, longitude } = position.coords;
            const mapContainer = document.getElementById('map');
            const option = {
              center: new window.kakao.maps.LatLng(latitude, longitude),
              level: 3,
            };
            // 현재 내 위치 마커 표시
            const mapInstance = new window.kakao.maps.Map(mapContainer, option);
            mapRef.current = mapInstance;
            const markerPosition = new window.kakao.maps.LatLng(latitude, longitude);
            const marker = new window.kakao.maps.Marker({
              position: markerPosition,
            });
            marker.setMap(mapInstance);

            // 검색어로 위치 검색 및 마커 표시
            if (value && value.trim() !== '') {
              const ps = new window.kakao.maps.services.Places();
              ps.keywordSearch(
                value,
                (data: Kakao.PlacesSearchResult, status: Kakao.Status) => {
                  placeSearchCallback(data, status, mapRef.current);
                  if (status === window.kakao.maps.services.Status.OK) {
                    setPlaces(data);
                  } else {
                    setPlaces([]);
                  }
                },
                { location: markerPosition, radius: 3000 }
              );
            } else {
              setPlaces([]);
            }
          },
          () => {
            const mapContainer = document.getElementById('map');
            const option = {
              center: new window.kakao.maps.LatLng(37.5665, 126.978), // 위치 거부시 서울 시청 위치
              level: 3,
            };
            // 기본 위치 마커 표시 (서울 시청)
            const mapInstance = new window.kakao.maps.Map(mapContainer, option);
            mapRef.current = mapInstance;
            const markerPosition = new window.kakao.maps.LatLng(37.5665, 126.978);
            const marker = new window.kakao.maps.Marker({
              position: markerPosition,
            });
            marker.setMap(mapInstance);
            if (value && value.trim() !== '') {
              const ps = new window.kakao.maps.services.Places();
              ps.keywordSearch(
                value,
                (data: Kakao.PlacesSearchResult, status: Kakao.Status) => {
                  placeSearchCallback(data, status, mapRef.current);
                  if (status === window.kakao.maps.services.Status.OK) {
                    setPlaces(data);
                  } else {
                    setPlaces([]);
                  }
                },
                { location: markerPosition, radius: 3000 }
              );
            }
          }
        );
      });
    };
    document.head.appendChild(script);

    return () => {
      setPlaces([]);
      const oldScript = document.querySelector(
        `script[src="//dapi.kakao.com/v2/maps/sdk.js?appkey=${KAKAOMAP}&autoload=false&libraries=services"]`
      );
      if (oldScript) {
        document.head.removeChild(oldScript);
      }
    };
  }, [KAKAOMAP, value]);

  // 장소 클릭 시 해당 위치로 지도 중심 이동
  const handlePlaceClick = useCallback((place: Kakao.PlaceItem) => {
    if (mapRef.current) {
      const lating = new window.kakao.maps.LatLng(place.y, place.x);
      mapRef.current.setCenter(lating);
      mapRef.current.setLevel(3);
    }
  }, []);

  return (
    <div style={{ width: '100%', height: '100%' }}>
      <div id="map" style={{ width: '100%', height: '70%' }} />
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
