import { StaticImageData } from 'next/image';
/*
이미지와 타이틀 제외 나머지 옵셔널 처리
 */
export interface CarouselItemsProps {
  src: (string | StaticImageData)[];
  title: string;
  category?: string;
  rating?: number | null;
  location?: string | null;
}

export interface CarouselProps {
  items: CarouselItemsProps[];
  duration?: number;
}
