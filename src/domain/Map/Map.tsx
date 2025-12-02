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
  const [geoError, setGeoError] = useState<string | null>(null);

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
            pos => {
              initMap(pos.coords.latitude, pos.coords.longitude);
            },
            err => {
              console.warn('위치 정보를 가져올 수 없습니다.', err);

              setGeoError(
                '현재 위치를 가져올 수 없어 기본 위치로 이동했습니다. 권한을 확인해주세요.'
              );

              initMap(); // 기본 위치로 이동
            }
          );
        }, 0);
      });
    })();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className={styles['map']}>
      {geoError && <div className={styles['map__geoError']}>{geoError}</div>}

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
