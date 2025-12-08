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

// 키워드로 장소 검색 후 지도 및 마커 설정
export function searchWithKeyword(
  value: string,
  defaultLat: number,
  defaultLng: number,
  mapRef: React.MutableRefObject<Kakao.Maps | null>,
  setPlaces: (places: Kakao.PlacesSearchResult) => void
) {
  const mapContainer = document.getElementById('map');
  if (!mapContainer) return;

  const keyword = value.trim();
  if (!keyword) {
    // 지도 초기화만
    const option = {
      center: new window.kakao.maps.LatLng(defaultLat, defaultLng),
      level: 3,
    };
    const mapInstance = new window.kakao.maps.Map(mapContainer, option);
    mapRef.current = mapInstance;
    setPlaces([]);
    return;
  }

  // 검색어로 장소 검색
  const ps = new window.kakao.maps.services.Places();
  ps.keywordSearch(keyword, (data: Kakao.PlacesSearchResult, status: Kakao.Status) => {
    placeSearchCallback(data, status, mapRef.current);
    if (status === window.kakao.maps.services.Status.OK && data.length > 0) {
      const first = data[0];
      const centerLat = Number(first.y);
      const centerLng = Number(first.x);

      const option = {
        center: new window.kakao.maps.LatLng(centerLat, centerLng),
        level: 3,
      };
      const mapInstance = new window.kakao.maps.Map(mapContainer, option);
      mapRef.current = mapInstance;

      // 중심 마커 표시
      const markerPosition = new window.kakao.maps.LatLng(centerLat, centerLng);
      const marker = new window.kakao.maps.Marker({
        position: markerPosition,
      });
      marker.setMap(mapInstance);

      // 해당 좌표 기준으로 다시 키워드 검색
      ps.keywordSearch(
        keyword,
        (data2: Kakao.PlacesSearchResult, status2: Kakao.Status) => {
          placeSearchCallback(data2, status2, mapRef.current);
          if (status2 === window.kakao.maps.services.Status.OK) {
            setPlaces(data2);
          } else {
            setPlaces([]);
          }
        },
        { location: markerPosition, radius: 3000 }
      );
    } else {
      const option = {
        center: new window.kakao.maps.LatLng(defaultLat, defaultLng),
        level: 3,
      };
      const mapInstance = new window.kakao.maps.Map(mapContainer, option);
      mapRef.current = mapInstance;
      setPlaces([]);
    }
  });
}
