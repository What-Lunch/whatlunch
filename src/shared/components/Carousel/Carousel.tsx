'use client';

import { useState, useEffect, useRef, useCallback, useLayoutEffect } from 'react';
import { Star, MapPin } from 'lucide-react';
import Image from 'next/image';
import { CarouselProps } from './type';

import styles from './Carousel.module.scss';

export default function Carousel({ items, duration = 3000 }: CarouselProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const [viewportWidth, setViewportWidth] = useState(0);
  const [dragOffset, setDragOffset] = useState(0);
  const [imageCounter, setImageCounter] = useState(3);

  const [favorites, setFavorites] = useState<Record<string, boolean>>({});
  const viewportRef = useRef<HTMLDivElement>(null);
  const startX = useRef(0);
  const isDragging = useRef(false);

  useLayoutEffect(() => {
    const measure = () => {
      setViewportWidth(viewportRef.current?.clientWidth ?? 0);
    };
    measure();
    window.addEventListener('resize', measure);
    return () => window.removeEventListener('resize', measure);
  }, []);

  // 반응형 이미지 개수
  useEffect(() => {
    const handleResize = () => {
      const w = window.innerWidth;

      if (w < 640) setImageCounter(2);
      else if (w < 1024) setImageCounter(3);
      else setImageCounter(4);
    };

    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const nextSlide = useCallback(() => {
    setCurrentIndex(prev => (prev + 1) % items.length);
  }, [items.length]);

  useEffect(() => {
    if (isPaused) return;
    const id = setInterval(nextSlide, duration);
    return () => clearInterval(id);
  }, [isPaused, duration, nextSlide]);

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
      if (dragOffset < 0) {
        nextSlide();
      } else {
        setCurrentIndex(i => (i === 0 ? items.length - 1 : i - 1));
      }
    }

    setDragOffset(0);
    setIsPaused(false);
    isDragging.current = false;
  };

  // 즐겨찾기 토글 id
  const toggleFavorite = (id: string) => {
    setFavorites(prev => ({ ...prev, [id]: !prev[id] }));
  };

  if (!items.length) return null;

  const translateX = -(currentIndex * viewportWidth) + dragOffset;

  return (
    <section
      className={styles['container']}
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
          style={{ transform: `translateX(${translateX}px)` }}
        >
          {items.map(item => {
            const isFavorite = favorites[item.id];

            return (
              <article key={item.id} className={styles['card']}>
                <div className={styles['card__header']}>
                  <div className={styles['card__titleRow']}>
                    <h2 className={styles['card__title']}>{item.title}</h2>

                    <button
                      type="button"
                      className={styles['ratingBadge']}
                      onClick={() => toggleFavorite(item.id)}
                      aria-pressed={isFavorite}
                      aria-label={
                        isFavorite ? `${item.title} 즐겨찾기 해제` : `${item.title} 즐겨찾기 추가`
                      }
                    >
                      <Star size={14} strokeWidth={2} fill={isFavorite ? 'currentColor' : 'none'} />
                      {item.rating !== undefined && item.rating !== null && (
                        <span className={styles['ratingBadge__text']}>{item.rating}</span>
                      )}
                    </button>
                  </div>

                  <div className={styles['card__meta']}>
                    {item.category && <span>{item.category}</span>}
                    {item.location && (
                      <span className={styles['card__location']}>
                        <MapPin size={14} />
                        {item.location}
                      </span>
                    )}
                  </div>
                </div>

                <div
                  className={[
                    styles['card__images'],
                    imageCounter === 2 && styles['card__images--two'],
                    imageCounter >= 4 && styles['card__images--four'],
                  ]
                    .filter(Boolean)
                    .join(' ')}
                >
                  {item.src.slice(0, imageCounter).map((src, idx) => (
                    <div key={idx} className={styles['card__image']}>
                      <Image
                        src={src}
                        alt={`${item.title} 이미지 ${idx + 1}`}
                        fill
                        sizes="
                          (max-width: 640px) 50vw,
                          (max-width: 1024px) 33vw,
                          200px
                        "
                      />
                    </div>
                  ))}
                </div>
              </article>
            );
          })}
        </div>
      </div>

      <nav aria-label="Carousel navigation" className={styles['dots']}>
        {items.map((_, index) => {
          const isActive = index === currentIndex;

          return (
            <button
              key={index}
              type="button"
              className={isActive ? styles['dots__active'] : styles['dots__inactive']}
              onClick={() => setCurrentIndex(index)}
              aria-label={`Go to slide ${index + 1}`}
              aria-current={isActive ? 'true' : undefined}
            />
          );
        })}
      </nav>
    </section>
  );
}
