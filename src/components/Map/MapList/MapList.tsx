import { MapPlace } from '../type';

import styles from './MapList.module.scss';

interface Props {
  places: MapPlace[];
  activeId: string | null;
  onItemClick: (id: string) => void;
}

export default function MapList({ places, activeId, onItemClick }: Props) {
  return (
    <div className={styles['list']}>
      {places.map(place => (
        <div
          key={place.id}
          className={`${styles['list__item']} ${
            activeId === place.id ? styles['list__item--active'] : ''
          }`}
          onClick={() => onItemClick(place.id)}
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
      ))}
    </div>
  );
}
