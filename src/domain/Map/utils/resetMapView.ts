export function resetMapView(
  map: kakao.maps.Map,
  kakao: typeof window.kakao,
  lat: number,
  lng: number,
  level = 4
) {
  setTimeout(() => {
    map.setCenter(new kakao.maps.LatLng(lat, lng));
    map.setLevel(level);
  }, 0);
}
