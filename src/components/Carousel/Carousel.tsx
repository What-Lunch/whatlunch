'use client';

import { useState, useEffect, useCallback, useRef, useLayoutEffect } from 'react';
import styles from './Carousel.module.scss';
import Image from 'next/image';

import { CarouselProps } from './type';

export default function Carousel({ items, duration = 3000 }: CarouselProps) {
  const [currentIndex, setCurrentIndex] = useState(0);

  const [isPaused, setIsPaused] = useState(false);
  const viewportRef = useRef<HTMLDivElement>(null);
  const [viewportWidth, setViewportWidth] = useState(0);

  const slideRef = useRef<HTMLDivElement>(null);
  const startX = useRef(0);
  const isDragging = useRef(false);

  useLayoutEffect(() => {
    const measure = () => setViewportWidth(viewportRef.current?.clientWidth ?? 0);
    measure();
    window.addEventListener('resize', measure);
    return () => window.removeEventListener('resize', measure);
  }, []);

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
      // setImageCounter(window.innerWidth < 768 ? 3 : 5);
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
  console.log('viewportWidth', viewportWidth);
  return (
    <section
      className={styles['container']}
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
      <div className={styles['carousel']} ref={viewportRef}>
        <div
          className={styles['carousel__track']}
          style={{
            transform: `translateX(-${currentIndex * viewportWidth}px)`,
            width: `${viewportWidth}px`,
          }}
          ref={slideRef}
        >
          {items.map(item => (
            <article className={styles['carousel__container']} key={item.title}>
              <div className={styles['carousel__container__info']}>
                <h2>{item.title}</h2>
                <div>
                  <span>{item.category}</span>
                  <span> • {item.rating}</span>
                </div>
                <span>{item.location}</span>
              </div>

              <div
                className={styles['carousel__container__images']}
                onClick={handleImageSlideClick}
              >
                {item.src.map((imageSrc, imageIndex) => (
                  <Image
                    aria-label={`Carousel Image ${imageIndex + 1}`}
                    key={`${item.title}-${imageIndex}`}
                    src={imageSrc}
                    alt={`${item.title} - Image ${imageIndex + 1}`}
                    width={120}
                    height={120}
                    loading={imageIndex === 0 ? 'eager' : 'lazy'}
                  />
                ))}
              </div>
            </article>
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
