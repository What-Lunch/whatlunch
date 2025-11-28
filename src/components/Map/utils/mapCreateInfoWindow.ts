import { MapPlace } from '../type';

export function mapCreateInfoWindow(place: MapPlace) {
  const kakao = window.kakao as typeof window.kakao;

  return new kakao.maps.InfoWindow({
    content: `
      <div style="padding:10px;font-size:14px;width:240px;">
        <b>${place.place_name}</b><br/>
        ${place.road_address_name || place.address_name}<br/>
        <a href="${place.place_url}" target="_blank"
          style="color:#1E88E5;margin-top:6px;display:inline-block;">
          자세히 보기
        </a>
      </div>
    `,
  });
}
