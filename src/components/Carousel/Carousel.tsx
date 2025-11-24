'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import styles from './Carousel.module.scss';
import Image from 'next/image';

import { CarouselProps } from './type';

export default function Carousel({ items, duration = 3000 }: CarouselProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [imageCounter, setImageCounter] = useState(5);
  const [isPaused, setIsPaused] = useState(false);

  const slideRef = useRef<HTMLDivElement>(null);
  const startX = useRef(0);
  const isDragging = useRef(false);

  const handleSlideChange = useCallback((newIndex: number) => {
    setCurrentIndex(prev => {
      if (newIndex === prev) return prev;
      return newIndex;
    });
  }, []);

  const nextSlide = useCallback(() => {
    setCurrentIndex(prev => (prev + 1) % items.length);
  }, [items.length]);

  const prevSlide = useCallback(() => {
    setCurrentIndex(prev => (prev === 0 ? items.length - 1 : prev - 1));
  }, [items.length]);

  const handlePageChange = useCallback(
    (index: number) => {
      handleSlideChange(index);
    },
    [handleSlideChange]
  );

  // 자동 슬라이드
  useEffect(() => {
    if (isPaused) return;

    const interval = setInterval(nextSlide, duration);
    return () => clearInterval(interval);
  }, [duration, isPaused, nextSlide]);

  // 반응형 이미지 개수 조절
  useEffect(() => {
    const handleResize = () => {
      setImageCounter(window.innerWidth < 768 ? 3 : 5);
    };

    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const handlePause = useCallback(() => setIsPaused(true), []);
  const handleResume = useCallback(() => setIsPaused(false), []);

  // 추가 로직
  const onDragStart = (e: React.MouseEvent | React.TouchEvent) => {
    isDragging.current = true;
    startX.current = 'touches' in e ? e.touches[0].clientX : e.clientX;
  };

  const onDragMove = (e: React.MouseEvent | React.TouchEvent) => {
    if (!isDragging.current || !slideRef.current) return;

    const currentX = 'touches' in e ? e.touches[0].clientX : e.clientX;
    const diff = currentX - startX.current;

    slideRef.current.scrollLeft -= diff;
    startX.current = currentX;
  };

  const onDragEnd = (e: React.MouseEvent | React.TouchEvent) => {
    if (!isDragging.current) return;

    const endX = 'changedTouches' in e ? e.changedTouches[0].clientX : e.clientX;
    const diff = endX - startX.current;

    if (Math.abs(diff) > 50) {
      if (diff < 0) nextSlide();
      else prevSlide();
    }

    isDragging.current = false;
  };

  const handleImageSlideClick = () => nextSlide();

  if (!items || items.length === 0) {
    return null;
  }

  return (
    <section
      className={styles['carousel']}
      aria-label="캐러셀 식당과 카페"
      onMouseEnter={handlePause}
      onMouseLeave={handleResume}
      onMouseDown={onDragStart}
      onMouseMove={onDragMove}
      onMouseUp={onDragEnd}
      onTouchStart={onDragStart}
      onTouchMove={onDragMove}
      onTouchEnd={onDragEnd}
    >
      <div className={styles['carousel__container']}>
        <div className={styles['carousel__container__info']}>
          <h2>{items[currentIndex].title}</h2>
          <div>
            <span>{items[currentIndex].category}</span>
            <span> • {items[currentIndex].rating}</span>
          </div>
          <span>{items[currentIndex].location}</span>
        </div>

        <div className={styles['carousel__container__images']} onClick={handleImageSlideClick}>
          {items[currentIndex].src.slice(0, imageCounter).map((imageSrc, index) => (
            <Image
              aria-label={`Carousel Image ${index + 1}`}
              key={`${currentIndex}-${index}`}
              src={imageSrc}
              alt={`${items[currentIndex].title} - Image ${index + 1}`}
              width={120}
              height={120}
              loading={index === 0 ? 'eager' : 'lazy'}
            />
          ))}
        </div>
      </div>

      <div aria-label="Carousel navigation" className={styles['carousel__dots']}>
        {items.map((_, index) => (
          <button
            type="button"
            aria-label={`Go to slide ${index + 1}`}
            key={index}
            onClick={() => handlePageChange(index)}
            className={
              currentIndex === index
                ? styles['carousel__dots__active']
                : styles['carousel__dots__inactive']
            }
          />
        ))}
      </div>
    </section>
  );
}
