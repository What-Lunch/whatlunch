'use client';

import React, { useCallback } from 'react';

import { MapListProps } from './type';

import styles from './MapList.module.scss';

function MapListComponent({ places, activeId, onItemClick }: MapListProps) {
  const handleClick = useCallback(
    (id: string) => {
      onItemClick(id);
    },
    [onItemClick]
  );

  return (
    <div className={styles['list']}>
      {places.map(place => {
        const isActive = activeId === place.id;

        return (
          <div
            key={place.id}
            className={`${styles['list__item']} ${isActive ? styles['list__item--active'] : ''}`}
            onClick={() => handleClick(place.id)}
            role="button"
            tabIndex={0}
          >
            <div className={styles['list__item__name']}>{place.place_name}</div>

            <div className={styles['list__item__address']}>
              {place.road_address_name || place.address_name}
            </div>

            <div className={styles['list__item__phone']}>{place.phone || '전화번호 없음'}</div>

            <div className={styles['list__item__actions']}>
              <a
                href={place.place_url}
                target="_blank"
                rel="noopener noreferrer"
                className={styles['list__item__detail']}
              >
                자세히 보기
              </a>

              <a
                href={`https://map.kakao.com/link/to/${place.place_name},${place.y},${place.x}`}
                target="_blank"
                rel="noopener noreferrer"
                className={styles['list__item__link']}
              >
                🚗 길찾기
              </a>
            </div>
          </div>
        );
      })}
    </div>
  );
}

export const MapList = React.memo(MapListComponent);
export default MapList;
