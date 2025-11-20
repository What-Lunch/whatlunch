'use client';
import { useState, useEffect, useCallback } from 'react';
import styles from './Carousel.module.scss';
import Image from 'next/image';

import { CarouselProps } from './type';

/* 추후 고쳐야 할 점
1. 이미지 - 추후 그냥 img태그를 쓰거나 next.config.js에 src 경로 추가해야 됨 
2. 임시 데이터 로직을 실제 데이터 로직으로 교체 (네이버 플레이스 API 연동)
*/
export default function Carousel({ items, duration = 3000 }: CarouselProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const [imageCounter, setImageCounter] = useState(5);

  const handleSlideChange = useCallback((newIndex: number) => {
    setCurrentIndex(prevIndex => {
      if (newIndex === prevIndex) return prevIndex;
      return newIndex;
    });
  }, []);

  const handlePageChange = useCallback(
    (index: number) => {
      handleSlideChange(index);
    },
    [handleSlideChange]
  );

  // 자동 슬라이드
  useEffect(() => {
    if (isPaused) return;
    const interval = setInterval(() => {
      handleSlideChange((currentIndex + 1) % items.length);
    }, duration);

    return () => clearInterval(interval);
  }, [currentIndex, items.length, handleSlideChange, duration, isPaused]);

  // 반응형 이미지 개수 조절
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 768) {
        setImageCounter(3);
      } else {
        setImageCounter(5);
      }
    };

    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const handlePause = useCallback(() => setIsPaused(true), []);
  const handleResume = useCallback(() => setIsPaused(false), []);

  return (
    <section
      className={styles['carousel']}
      aria-label="캐러셀 식당과 카페"
      onMouseEnter={handlePause}
      onMouseLeave={handleResume}
      onFocus={handlePause}
      onBlur={handleResume}
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

        <div className={styles['carousel__container__images']}>
          {items[currentIndex].src.slice(0, imageCounter).map((imageSrc, index) => (
            <Image
              aria-label={`Carousel Image ${index + 1}`}
              key={imageSrc ? imageSrc.toString() : index}
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

// 'use client';
// import { useState, useEffect, useCallback, useRef } from 'react';
// import styles from './Carousel.module.scss';
// import Image from 'next/image';

// import { CarouselProps } from './type';

// /* 추후 고쳐야 할 점
// 1. 이미지 - 추후 그냥 img태그를 쓰거나 next.config.js에 src 경로 추가해야 됨
// 2. 임시 데이터 로직을 실제 데이터 로직으로 교체 (네이버 플레이스 API 연동)
// */
// export default function Carousel({ items, duration = 3000 }: CarouselProps) {
//   const [currentIndex, setCurrentIndex] = useState(0);
//   const [isPaused, setIsPaused] = useState(false);
//   const [imageCounter, setImageCounter] = useState(5);
//   const slideRef = useRef<HTMLDivElement>(null);
//   const isAutoScrolling = useRef(false);

//   const handleScroll = useCallback(() => {
//     if (isAutoScrolling.current) return;
//     if (slideRef.current) {
//       const { scrollLeft, offsetWidth } = slideRef.current;
//       const index = Math.round(scrollLeft / offsetWidth);
//       setCurrentIndex(index);
//     }
//   }, []);

//   const handleSlideChange = useCallback((newIndex: number) => {
//     setCurrentIndex(prevIndex => {
//       if (newIndex === prevIndex) return prevIndex;
//       return newIndex;
//     });
//   }, []);

//   const handlePageChange = useCallback(
//     (index: number) => {
//       handleSlideChange(index);
//     },
//     [handleSlideChange]
//   );

//   // 자동 슬라이드
//   useEffect(() => {
//     if (isPaused) return;

//     const interval = setInterval(() => {
//       setCurrentIndex(prevIndex => (prevIndex + 1) % items.length);
//     }, duration);

//     return () => clearInterval(interval);
//   }, [items.length, duration, isPaused]);

//   // 슬라이드 이동 시 스크롤 애니메이션
//   useEffect(() => {
//     if (slideRef.current) {
//       isAutoScrolling.current = true;

//       slideRef.current.scrollTo({
//         left: slideRef.current.offsetWidth * currentIndex,
//         behavior: 'smooth',
//       });

//       setTimeout(() => {
//         isAutoScrolling.current = false;
//       }, 500);
//     }
//   }, [currentIndex]);

//   // 반응형 이미지 개수 조절
//   useEffect(() => {
//     const handleResize = () => {
//       if (window.innerWidth < 768) {
//         setImageCounter(3);
//       } else {
//         setImageCounter(5);
//       }
//     };

//     handleResize();
//     window.addEventListener('resize', handleResize);
//     return () => window.removeEventListener('resize', handleResize);
//   }, []);

//   const handlePause = useCallback(() => setIsPaused(true), []);
//   const handleResume = useCallback(() => setIsPaused(false), []);

//   // const handleNext = useCallback(() => {
//   //   if (currentIndex < items.length - 1) {
//   //     setCurrentIndex(prev => prev + 1);
//   //   }
//   // }, [currentIndex, items.length]);

//   // const handlePrev = useCallback(() => {
//   //   if (currentIndex > 0) {
//   //     setCurrentIndex(prev => prev - 1);
//   //   }
//   // }, [currentIndex]);

//   // const showLeftButton = currentIndex > 0;
//   // const showRightButton = currentIndex < items.length - 1;
//   return (
//     <section
//       className={styles['carousel']}
//       aria-label="캐러셀 식당과 카페"
//       onMouseEnter={handlePause}
//       onMouseLeave={handleResume}
//       onFocus={handlePause}
//       onBlur={handleResume}
//     >
//       <div className={styles['carousel__container']}>
//         <div className={styles['carousel__container__info']}>
//           <h2>{items[currentIndex].title}</h2>
//           <div>
//             <span>{items[currentIndex].category}</span>
//             <span> • {items[currentIndex].rating}</span>
//           </div>
//           <span>{items[currentIndex].location}</span>
//         </div>

//         <div className={styles['carousel__container__slider']}>
//           <div
//             className={styles['carousel__container__images']}
//             ref={slideRef}
//             onScroll={handleScroll}
//           >
//             {items.map((item, idx) => (
//               <div className={styles['carousel__container__slide']} key={idx}>
//                 {item.src.slice(0, imageCounter).map((imageSrc, index) => (
//                   <Image
//                     aria-label={`Carousel Image ${index + 1}`}
//                     key={imageSrc ? imageSrc.toString() : index}
//                     src={imageSrc}
//                     alt={`${item.title} - Image ${index + 1}`}
//                     width={120}
//                     height={120}
//                     loading={idx === 0 ? 'eager' : 'lazy'}
//                     draggable={false}
//                   />
//                 ))}
//               </div>
//             ))}
//           </div>
//         </div>
//       </div>
//       <div aria-label="Carousel navigation" className={styles['carousel__dots']}>
//         {items.map((_, index) => (
//           <button
//             type="button"
//             aria-label={`Go to slide ${index + 1}`}
//             key={index}
//             onClick={() => handlePageChange(index)}
//             className={
//               currentIndex === index
//                 ? styles['carousel__dots__active']
//                 : styles['carousel__dots__inactive']
//             }
//           />
//         ))}
//       </div>
//     </section>
//   );
// }
