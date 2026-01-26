import { StaticImageData } from 'next/image';

export interface CarouselStore {
  id: string;
  name: string;
  location: string;
  image: string | StaticImageData;
}

export interface CarouselItem {
  id: string;
  menuName: string;
  rank: number;
  favoriteCount: number;
  stores: CarouselStore[];
}

export interface CarouselProps {
  items: CarouselItem[];
  duration?: number;
}
