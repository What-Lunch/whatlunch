'use client';
import { useEffect } from 'react';

export default function KakaoMap() {
  const KAKAOMAP = process.env.NEXT_PUBLIC_KAKAO_MAP_KEY;

  // Load Kakao Map script
  useEffect(() => {
    const script = document.createElement('script');
    script.src = `//dapi.kakao.com/v2/maps/sdk.js?appkey=${KAKAOMAP}&autoload=false`;

    script.onload = () => {
      window.kakao.maps.load(() => {
        const mapContainer = document.getElementById('map');
        const option = {
          center: new window.kakao.maps.LatLng(37.5665, 126.978), // 서울 위치
          level: 3,
        };
        new window.kakao.maps.Map(mapContainer, option);
      });
    };
    document.head.appendChild(script);
  }, [KAKAOMAP]);
  return <div id="map" style={{ width: '100%', height: '400px' }} />;
}
