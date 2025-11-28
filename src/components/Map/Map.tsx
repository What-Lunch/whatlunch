'use client';

import { useEffect, useRef, useState } from 'react';
import styles from './Map.module.scss';

import { MapPanel } from './MapPanel';
import { MapList } from './MapList';
import { MapPlace } from './type';

import {
  useMapKakaoLoader,
  useMapKakaoMap,
  useMapMarkers,
  useMapSearchKeyword,
  useMapSearchCategory,
} from './hooks';

export default function Map() {
  const mapRef = useRef<HTMLDivElement | null>(null);

  const [keyword, setKeyword] = useState('');
  const [places, setPlaces] = useState<MapPlace[]>([]);
  const [activeId, setActiveId] = useState<string | null>(null);

  const { loadKakao, waitForKakao } = useMapKakaoLoader();

  const { kakaoRef, mapObjRef, clustererRef, userLocationRef, initMap } = useMapKakaoMap(mapRef);

  const { createMarkers, resetMarkers } = useMapMarkers(
    kakaoRef,
    mapObjRef,
    clustererRef,
    setActiveId
  );

  const { searchKeyword } = useMapSearchKeyword(kakaoRef, mapObjRef, createMarkers);

  const { searchCategory } = useMapSearchCategory(
    kakaoRef,
    mapObjRef,
    userLocationRef,
    createMarkers
  );

  useEffect(() => {
    (async () => {
      await loadKakao();
      await waitForKakao();

      window.kakao.maps.load(() => {
        kakaoRef.current = window.kakao;

        navigator.geolocation.getCurrentPosition(
          pos => initMap(pos.coords.latitude, pos.coords.longitude),
          () => initMap(37.5665, 126.978)
        );
      });
    })();
  }, []);

  return (
    <div className={styles['map']}>
      {/* Left: 검색 + 리스트 */}
      <div className={styles['map__left']}>
        <MapPanel
          keyword={keyword}
          setKeyword={setKeyword}
          onKeywordSearch={() => searchKeyword(keyword, setPlaces)}
          onCategoryClick={code => searchCategory(code, setPlaces)}
          onReset={() => {
            resetMarkers();
            setPlaces([]);
            setActiveId(null);
            setKeyword('');
          }}
        />

        <MapList places={places} activeId={activeId} />
      </div>

      <div className={styles['map__right']}>
        <div ref={mapRef} className={styles['map__canvas']}></div>
      </div>
    </div>
  );
}
