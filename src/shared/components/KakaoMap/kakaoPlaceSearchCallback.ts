export function placeSearchCallback(
  data: Kakao.PlacesSearchResult,
  status: Kakao.Status,
  map: Kakao.Maps | null
) {
  if (status === window.kakao.maps.services.Status.OK) {
    data.forEach((place: Kakao.PlaceItem) => {
      const placeMarker = new window.kakao.maps.Marker({
        map: map,
        position: new window.kakao.maps.LatLng(place.y, place.x),
      });

      const infowindow = new window.kakao.maps.InfoWindow({
        content: `<div style="padding:5px;font-size:12px;">${place.place_name}</div>`,
      });

      window.kakao.maps.event.addListener(placeMarker, 'click', function () {
        infowindow.open(map, placeMarker);
      });
    });
  }
}
