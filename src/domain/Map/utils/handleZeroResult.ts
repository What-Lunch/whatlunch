import { MapPlace } from '../type';

export function handleZeroResult(
  setPlaces: (p: MapPlace[]) => void,
  createMarkers: (p: MapPlace[]) => void
) {
  setPlaces([]);
  createMarkers([]);
}
