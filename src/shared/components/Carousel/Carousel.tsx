'use client';

import { useState, useEffect, useRef, useCallback, useLayoutEffect } from 'react';
import styles from './Carousel.module.scss';
import Image from 'next/image';
import { CarouselProps } from './type';

/**
 * TODO
 * 1. 백엔드 연동시 items 타입 재검토 필요
 * 2. 스켈레톤 UI 필요d
 */
export default function Carousel({ items, duration = 3000 }: CarouselProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [imageCounter, setImageCounter] = useState(5);
  const [isPaused, setIsPaused] = useState(false);
  const [viewportWidth, setViewportWidth] = useState(0);
  const [carouselHeight, setCarouselHeight] = useState(0);
  const [dragOffset, setDragOffset] = useState(0);

  const viewportRef = useRef<HTMLDivElement>(null);
  const slideRef = useRef<HTMLDivElement>(null);
  const startX = useRef(0);
  const isDragging = useRef(false);

  useLayoutEffect(() => {
    const measure = () => setViewportWidth(viewportRef.current?.clientWidth ?? 0);
    measure();
    window.addEventListener('resize', measure);
    return () => window.removeEventListener('resize', measure);
  }, []);

  const handlePageChange = (index: number) => setCurrentIndex(index);
  const handlePause = () => setIsPaused(true);
  const handleResume = () => setIsPaused(false);

  const nextSlide = useCallback(
    () => setCurrentIndex(prev => (prev + 1) % items.length),
    [items.length]
  );

  const prevSlide = useCallback(
    () => setCurrentIndex(prev => (prev === 0 ? items.length - 1 : prev - 1)),
    [items.length]
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
      if (window.innerWidth < 1536) {
        setImageCounter(3);
        setCarouselHeight(viewportWidth / (3 + 1));
      } else {
        setImageCounter(3);
        setCarouselHeight(viewportWidth / 4);
      }
    };

    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [viewportWidth]);

  // 추가 로직
  const onDragStart = (e: React.MouseEvent | React.TouchEvent) => {
    isDragging.current = true;
    startX.current = 'touches' in e ? e.touches[0].clientX : e.clientX;
  };

  const onDragMove = (e: React.MouseEvent | React.TouchEvent) => {
    if (!isDragging.current) return;
    const currentX = 'touches' in e ? e.touches[0].clientX : e.clientX;
    setDragOffset(currentX - startX.current);
  };

  const onDragEnd = () => {
    if (!isDragging.current) return;
    if (Math.abs(dragOffset) > 50) {
      if (dragOffset < 0) nextSlide();
      else prevSlide();
    }
    setDragOffset(0);
    isDragging.current = false;
  };

  if (!items || items.length === 0) {
    return null;
  }

  const trackWidth = viewportWidth - viewportWidth * currentIndex;

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
          role="list"
          style={{
            transform: `translateX(${trackWidth - viewportWidth + dragOffset}px)`,
            width: `${viewportWidth}px`,
          }}
          ref={slideRef}
        >
          {items.map((item, index) => (
            <article
              className={styles['carousel__article']}
              key={item.title}
              data-testid={`carousel-item-${index}`}
              role="listitem"
            >
              <div className={styles['carousel__info']}>
                <h2>{item.title}</h2>
                <div>
                  <span>{item.category}</span>
                  <span> • {item.rating}</span>
                </div>
                <span>{item.location}</span>
              </div>

              <div className={styles['carousel__images']} onClick={nextSlide}>
                {item.src.slice(0, imageCounter).map((imageSrc, imageIndex) => (
                  <Image
                    aria-label={`Carousel Image ${imageIndex + 1}`}
                    key={`${item.title}-${imageIndex}`}
                    src={imageSrc}
                    alt={`${item.title} - Image ${imageIndex + 1}`}
                    width={carouselHeight ? carouselHeight : 200}
                    height={carouselHeight ? carouselHeight : 200}
                    loading={imageIndex === 0 ? 'eager' : 'lazy'}
                  />
                ))}
              </div>
            </article>
          ))}
        </div>
      </div>
      <nav aria-label="Carousel navigation" className={styles['dots']}>
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
      </nav>
    </section>
  );
}
