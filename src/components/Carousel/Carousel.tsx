'use client';
import { useState, useEffect } from 'react';
import Image from 'next/image';
import styles from './Carousel.module.scss';

// 테스트용 이미지들 추후 교체 필요
import Test1 from '../../../public/test/images/test1.png';
import Test2 from '../../../public/test/images/test2.png';
import Test3 from '../../../public/images/test/test3.png';

// 자동 스크롤 처리, 마우스 호버시 멈춤 기능, 밑 페이지네이션 클릭시 해당 이미지로 이동, 속도감있게 캐러쉘
export default function Carousel() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isHover, setIsHover] = useState(false);
  const images = [Test1, Test2, Test3];

  useEffect(() => {
    if (isHover) return;

    const interval = setInterval(() => {
      setCurrentIndex(prevIndex => (prevIndex + 1) % images.length);
    }, 3000);

    return () => clearInterval(interval);
  }, [isHover, images.length]);
  return (
    <section
      className={styles['carousel']}
      onMouseEnter={() => setIsHover(true)}
      onMouseLeave={() => setIsHover(false)}
    >
      <div>
        {images.map((image, index) => (
          <Image
            key={image.src}
            src={image}
            alt={`Carousel Image ${index + 1}`}
            width={600}
            height={300}
            loading={currentIndex === index ? 'eager' : 'lazy'}
            className={
              index === currentIndex
                ? styles['carousel__image--active']
                : styles['carousel__image--inactive']
            }
          />
        ))}
      </div>
      <div>
        {images.map((image, index) => (
          <button key={image.src} onClick={() => setCurrentIndex(index)}>
            {index + 1}
          </button>
        ))}
      </div>
    </section>
  );
}
