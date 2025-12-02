export const MARKER_HOVER_ICON_URL =
  'https://t1.daumcdn.net/localimg/localimages/07/mapapidoc/marker_red.png';

export const MARKER_ACTIVE_ICON_URL =
  'https://t1.daumcdn.net/localimg/localimages/07/mapapidoc/markerStar.png';

export const MARKER_HOVER_ICON_SIZE = { width: 30, height: 34 };
export const MARKER_ACTIVE_ICON_SIZE = { width: 28, height: 40 };

export function mapMarkerHoverIcon() {
  return new window.kakao.maps.MarkerImage(
    MARKER_HOVER_ICON_URL,
    new window.kakao.maps.Size(MARKER_HOVER_ICON_SIZE.width, MARKER_HOVER_ICON_SIZE.height)
  );
}

export function mapMarkerActiveIcon() {
  return new window.kakao.maps.MarkerImage(
    MARKER_ACTIVE_ICON_URL,
    new window.kakao.maps.Size(MARKER_ACTIVE_ICON_SIZE.width, MARKER_ACTIVE_ICON_SIZE.height)
  );
}
