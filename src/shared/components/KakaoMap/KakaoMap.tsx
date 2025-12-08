'use client';
import { useEffect } from 'react';

export default function KakaoMap() {
  const KAKAOMAP = process.env.NEXT_PUBLIC_KAKAO_MAP_KEY;

  // Load Kakao Map script
  useEffect(() => {
    const script = document.createElement('script');
    script.src = `//dapi.kakao.com/v2/maps/sdk.js?appkey=${KAKAOMAP}&autoload=false`;

    // let markerPosition = new window.kakao.maps.LatLng(33.450701, 126.570667);

    script.onload = () => {
      window.kakao.maps.load(() => {
        navigator.geolocation.getCurrentPosition(
          position => {
            const { latitude, longitude } = position.coords;
            const mapContainer = document.getElementById('map');
            const option = {
              center: new window.kakao.maps.LatLng(latitude, longitude),
              level: 3,
            };
            // 현재 위치 마커 표시
            const map = new window.kakao.maps.Map(mapContainer, option);
            const markerPosition = new window.kakao.maps.LatLng(latitude, longitude);
            const marker = new window.kakao.maps.Marker({
              position: markerPosition,
            });
            marker.setMap(map);
          },
          () => {
            const mapContainer = document.getElementById('map');
            const option = {
              center: new window.kakao.maps.LatLng(37.5665, 126.978), // 서울 시청 위치
              level: 3,
            };
            const map = new window.kakao.maps.Map(mapContainer, option);
            const markerPosition = new window.kakao.maps.LatLng(37.5665, 126.978);
            const marker = new window.kakao.maps.Marker({
              position: markerPosition,
            });
            marker.setMap(map);
          }
        );
      });
    };
    document.head.appendChild(script);
  }, [KAKAOMAP]);
  return <div id="map" style={{ width: '100%', height: '100%' }} />;
}
