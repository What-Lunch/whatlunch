'use client';

import { useState, useEffect, useRef, useCallback, useLayoutEffect } from 'react';
import { MapPin } from 'lucide-react';
import Image from 'next/image';

import { CarouselProps } from './type';
import FavoriteToggle from '../FavoriteToggle';

import styles from './Carousel.module.scss';

export default function Carousel({ items, duration = 3000 }: CarouselProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const [viewportWidth, setViewportWidth] = useState(0);
  const [dragOffset, setDragOffset] = useState(0);

  const viewportRef = useRef<HTMLDivElement>(null);
  const startX = useRef(0);
  const isDragging = useRef(false);

  // 뷰포트 너비 측정
  useLayoutEffect(() => {
    const measure = () => {
      if (viewportRef.current) {
        setViewportWidth(viewportRef.current.offsetWidth);
      }
    };
    measure();
    window.addEventListener('resize', measure);
    return () => window.removeEventListener('resize', measure);
  }, []);

  // 자동 슬라이드
  const nextSlide = useCallback(() => {
    if (items.length <= 1) return;
    setCurrentIndex(prev => (prev + 1) % items.length);
  }, [items.length]);

  useEffect(() => {
    if (isPaused || items.length <= 1) return;
    const id = setInterval(nextSlide, duration);
    return () => clearInterval(id);
  }, [isPaused, duration, nextSlide, items.length]);

  const onDragStart = (e: React.MouseEvent | React.TouchEvent) => {
    isDragging.current = true;
    setIsPaused(true);
    startX.current = 'touches' in e ? e.touches[0].clientX : (e as React.MouseEvent).clientX;
  };

  const onDragMove = (e: React.MouseEvent | React.TouchEvent) => {
    if (!isDragging.current) return;
    const x = 'touches' in e ? e.touches[0].clientX : (e as React.MouseEvent).clientX;
    setDragOffset(x - startX.current);
  };

  const onDragEnd = () => {
    if (!isDragging.current) return;
    if (Math.abs(dragOffset) > 50) {
      if (dragOffset < 0) nextSlide();
      else setCurrentIndex(i => (i === 0 ? items.length - 1 : i - 1));
    }
    setDragOffset(0);
    setIsPaused(false);
    isDragging.current = false;
  };

  if (!items.length) return null;
  const translateX = -(currentIndex * viewportWidth) + dragOffset;

  return (
    <section
      className={styles['container']}
      onMouseDown={onDragStart}
      onMouseMove={onDragMove}
      onMouseUp={onDragEnd}
      onMouseLeave={onDragEnd}
      onTouchStart={onDragStart}
      onTouchMove={onDragMove}
      onTouchEnd={onDragEnd}
    >
      <div className={styles['carousel']} ref={viewportRef}>
        <div
          className={styles['carousel__track']}
          style={{
            transform: `translateX(${translateX}px)`,
            transition: isDragging.current
              ? 'none'
              : 'transform 0.5s cubic-bezier(0.25, 1, 0.5, 1)',
          }}
        >
          {items.map(item => (
            <article key={item.id} className={styles['card']} style={{ width: viewportWidth }}>
              <div className={styles['card__header']}>
                <div className={styles['card__rankBadge']}>{item.rank}위</div>
                <div className={styles['card__titleRow']}>
                  <h2 className={styles['card__title']}>인기 급상승! {item.menuName} 맛집</h2>
                  <div className={styles['ratingBadge']}>
                    <span className={styles['ratingBadge__text']}>
                      {item.favoriteCount}명이 찜했어요
                    </span>
                    <FavoriteToggle isActive={true} readOnly={true} size={16} />
                  </div>
                </div>
              </div>

              <div className={styles['card__images']}>
                {item.stores.slice(0, 4).map(store => (
                  <div key={store.id} className={styles['card__imageContainer']}>
                    {/* 이미지를 클릭하면 상세페이지로 이동하는 로직을 여기에 추가하면 됩니다 (Link 등) */}
                    <div className={styles['card__image']}>
                      <Image
                        src={store.image}
                        alt={store.name}
                        fill
                        className={styles['img']}
                        sizes="25vw"
                        // 이미지 자체의 '파일 드래그(ghost image)'는 막아두어 터치 드래그감을 좋게 유지
                        draggable={false}
                      />
                    </div>
                    <div className={styles['card__storeInfo']}>
                      <p className={styles['card__storeName']}>{store.name}</p>
                      <p className={styles['card__storeLoc']}>
                        <MapPin size={10} /> {store.location}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </article>
          ))}
        </div>
      </div>

      <nav className={styles['dots']}>
        {items.map((_, index) => (
          <button
            key={index}
            className={index === currentIndex ? styles['dots__active'] : styles['dots__inactive']}
            onClick={() => setCurrentIndex(index)}
          />
        ))}
      </nav>
    </section>
  );
}
