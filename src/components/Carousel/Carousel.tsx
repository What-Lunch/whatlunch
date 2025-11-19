'use client';
import { useState, useEffect, useCallback, useMemo } from 'react';
import styles from './Carousel.module.scss';
import Image from 'next/image';

import { CarouselProps, CarouselItemsProps } from './type';

import One1 from '../../../public/images/test/1.jpeg';
import One2 from '../../../public/images/test/2.jpeg';
import One5 from '../../../public/images/test/15.jpeg';

import Two1 from '../../../public/images/test/6.jpeg';
import Two2 from '../../../public/images/test/7.jpeg';
import Two3 from '../../../public/images/test/8.jpeg';
import Two4 from '../../../public/images/test/9.jpeg';
import Two5 from '../../../public/images/test/5.jpeg';

import Three1 from '../../../public/images/test/10.jpeg';
import Three4 from '../../../public/images/test/14.jpeg';

/* 추후 고쳐야 할 점
1. 이미지 - 추후 그냥 img태그를 쓰거나 next.config.js에 src 경로 추가해야 됨 
2. 임시 데이터 로직을 실제 데이터 로직으로 교체 (네이버 플레이스 API 연동)
*/
export default function Carousel({ items, duration = 3000 }: CarouselProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [isPaused, setIsPaused] = useState(false);

  // 테스트용 이미지 데이터
  const pendingData: CarouselItemsProps[] = useMemo(() => {
    const TestImage = [One1, One2, One1, One2, One5];
    const TestImage2 = [Two1, Two2, Two3, Two4, Two5];
    const TestImage3 = [Three1, Three1, Three4, Three4, Three1];

    return items && items.length > 0
      ? items
      : [
          {
            src: TestImage,
            title: '너무맛있는곰장어집',
            category: '식당',
            rating: 4.5,
            location: '서울 마포',
          },
          {
            src: TestImage2,
            title: '여긴어디지고기집',
            category: '식당',
            rating: 4.0,
            location: '서울 강남',
          },
          {
            src: TestImage3,
            title: '메가메가메가커피',
            category: '카페',
            rating: 3.5,
            location: '충남 대전',
          },
        ];
  }, [items]);

  // 아래부터 실제 로직
  const handleSlideChange = useCallback(
    (newIndex: number) => {
      if (newIndex === currentIndex) return;

      setIsTransitioning(true);

      setTimeout(() => {
        setCurrentIndex(newIndex);
        setIsTransitioning(false);
      }, 300);
    },
    [currentIndex]
  );

  const handlePageChange = useCallback(
    (index: number) => {
      handleSlideChange(index);
    },
    [handleSlideChange]
  );

  useEffect(() => {
    if (isPaused) return;
    const interval = setInterval(() => {
      handleSlideChange((currentIndex + 1) % pendingData.length);
    }, duration);

    return () => clearInterval(interval);
  }, [currentIndex, pendingData.length, handleSlideChange, duration, isPaused]);

  return (
    <section
      className={styles['carousel']}
      aria-label="캐러셀 식당과 카페"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
      onFocus={() => setIsPaused(true)}
      onBlur={() => setIsPaused(false)}
    >
      <div className={styles['carousel__container']}>
        <div
          className={`${styles['carousel__container__info']} ${isTransitioning ? styles['fadeOut'] : ''}`}
        >
          <h2>{pendingData[currentIndex].title}</h2>
          <div>
            <span>{pendingData[currentIndex].category}</span>
            <span> • {pendingData[currentIndex].rating}</span>
          </div>
          <span>{pendingData[currentIndex].location}</span>
        </div>
        <div className={styles['carousel__container__images']}>
          {pendingData[currentIndex].src.map((imageSrc, index) => (
            <Image
              aria-label={`Carousel Image ${index + 1}`}
              key={imageSrc ? imageSrc.toString() : index}
              src={imageSrc}
              alt={`${pendingData[currentIndex].title} - Image ${index + 1}`}
              width={120}
              height={120}
              loading={index === 0 ? 'eager' : 'lazy'}
            />
          ))}
        </div>
      </div>
      <div aria-label="Carousel navigation">
        {pendingData.map((_, index) => (
          <button
            type="button"
            aria-label={`Go to slide ${index + 1}`}
            key={index}
            onClick={() => handlePageChange(index)}
            className={
              currentIndex === index
                ? styles['carousel__dotActive']
                : styles['carousel__dotInactive']
            }
          />
        ))}
      </div>
    </section>
  );
}
