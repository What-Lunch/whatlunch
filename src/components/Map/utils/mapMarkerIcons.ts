export function mapMarkerHoverIcon() {
  return new window.kakao.maps.MarkerImage(
    'https://t1.daumcdn.net/localimg/localimages/07/mapapidoc/marker_red.png',
    new window.kakao.maps.Size(30, 34)
  );
}

export function mapMarkerActiveIcon() {
  return new window.kakao.maps.MarkerImage(
    'https://t1.daumcdn.net/localimg/localimages/07/mapapidoc/markerStar.png',
    new window.kakao.maps.Size(28, 40)
  );
}
