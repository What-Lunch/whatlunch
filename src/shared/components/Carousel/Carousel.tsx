'use client';

import { useState, useEffect, useRef, useCallback, useLayoutEffect } from 'react';
import { Store } from 'lucide-react';
import Image from 'next/image';

import { CarouselProps } from './type';
import FavoriteToggle from '../FavoriteToggle';

import styles from './Carousel.module.scss';

const DEFAULT_IMAGE = '/foods/Korean/noimg.png';

export default function Carousel({ items, duration = 3000 }: CarouselProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const [viewportWidth, setViewportWidth] = useState(0);
  const [dragOffset, setDragOffset] = useState(0);

  const viewportRef = useRef<HTMLDivElement>(null);
  const startX = useRef(0);
  const isDragging = useRef(false);

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
    startX.current = 'touches' in e ? e.touches[0].clientX : e.clientX;
  };

  const onDragMove = (e: React.MouseEvent | React.TouchEvent) => {
    if (!isDragging.current) return;
    const x = 'touches' in e ? e.touches[0].clientX : e.clientX;
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
          {items.map((item, index) => {
            const safeStores =
              item.stores.length > 0
                ? item.stores.slice(0, 4)
                : Array.from({ length: 4 }, (_, idx) => ({
                    id: `fallback-store-${idx}`,
                    name: '',
                    image: DEFAULT_IMAGE,
                  }));

            return (
              <article
                key={`${item.id}-${index}`}
                className={styles['card']}
                style={{ width: viewportWidth }}
              >
                <div className={styles['card__header']}>
                  <span className={styles['card__rankBadge']}>{item.rank}위</span>

                  <div className={styles['card__titleRow']}>
                    <h2 className={styles['card__title']}>
                      요즘 많이 선택되는{' '}
                      <span className={styles['card__menuName']}>{item.menuName}</span> · 대표
                      브랜드
                    </h2>

                    <div className={styles['rating-badge']}>
                      <span className={styles['rating-badge__text']}>
                        {item.favoriteCount > 0
                          ? `${item.favoriteCount}명이 찜했어요`
                          : '아직 찜한 사람이 없어요'}
                      </span>
                      <FavoriteToggle isActive readOnly size={16} />
                    </div>
                  </div>
                </div>

                <div className={styles['card__images']}>
                  {safeStores.map(store => (
                    <div key={store.id} className={styles['card__imageContainer']}>
                      <div className={styles['card__image']}>
                        <Image
                          src={store.image}
                          alt={store.name || item.menuName}
                          fill
                          unoptimized
                          className={styles['img']}
                          sizes="25vw"
                          priority={index === 0 && currentIndex === 0}
                          draggable={false}
                        />
                      </div>

                      {store.name && (
                        <div className={styles['card__storeInfo']}>
                          <Store size={16} />
                          <p className={styles['card__storeName']}>{store.name}</p>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </article>
            );
          })}
        </div>
      </div>

      <nav className={styles['dots']} aria-label="슬라이드 이동 메뉴">
        {items.map((_, index) => {
          const isActive = index === currentIndex;
          return (
            <button
              key={index}
              type="button"
              aria-label={`Go to slide ${index + 1}`}
              aria-current={isActive ? 'true' : undefined}
              className={isActive ? styles['dots__active'] : styles['dots__inactive']}
              onClick={() => setCurrentIndex(index)}
            />
          );
        })}
      </nav>
    </section>
  );
}
