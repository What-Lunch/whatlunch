import { MapPlace } from '../../type';

export interface MapListProps {
  places: MapPlace[];
  activeId: string | null;
  onItemClick: (id: string) => void;
}
