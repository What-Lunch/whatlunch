'use client';

import { useEffect, useRef, useState } from 'react';

import { useMapKakaoLoader } from './hooks/useMapKakaoLoader';
import { useMapKakaoMap } from './hooks/useMapKakaoMap';
import { useMapMarkers } from './hooks/useMapMarkers';
import { useMapSearchKeyword } from './hooks/useMapSearchKeyword';
import { useMapSearchCategory } from './hooks/useMapSearchCategory';

import { MapPanel } from './MapPanel';
import { MapList } from './MapList';

import { MapPlace } from './type';

import styles from './Map.module.scss';

export default function Map() {
  const mapRef = useRef<HTMLDivElement | null>(null);

  const [keyword, setKeyword] = useState('');
  const [places, setPlaces] = useState<MapPlace[]>([]);
  const [activeId, setActiveId] = useState<string | null>(null);

  const { loadKakao, waitForKakao } = useMapKakaoLoader();

  const { kakaoRef, setKakao, mapObjRef, clustererRef, userLocationRef, initMap } =
    useMapKakaoMap(mapRef);

  const { createMarkers, resetMarkers, activateMarkerById } = useMapMarkers(
    kakaoRef,
    mapObjRef,
    clustererRef,
    setActiveId
  );

  const { searchKeyword } = useMapSearchKeyword(
    kakaoRef,
    mapObjRef,
    userLocationRef,
    createMarkers
  );

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
        setKakao();

        setTimeout(() => {
          navigator.geolocation.getCurrentPosition(
            pos => initMap(pos.coords.latitude, pos.coords.longitude),
            () => initMap()
          );
        }, 0);
      });
    })();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className={styles['map']}>
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

        <MapList
          places={places}
          activeId={activeId}
          onItemClick={id => {
            setActiveId(id);
            activateMarkerById(id);
          }}
        />
      </div>

      <div className={styles['map__right']}>
        <div ref={mapRef} className={styles['map__canvas']}></div>
      </div>
    </div>
  );
}
