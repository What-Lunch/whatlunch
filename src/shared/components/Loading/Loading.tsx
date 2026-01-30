'use client';

import React, { useEffect, useState } from 'react';
import { createPortal } from 'react-dom';
import Lottie from 'lottie-react';

import food from '../../../../public/animations/food.json';
import styles from './Loading.module.scss';

export default function Loading() {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (typeof window === 'undefined' || !mounted) return null;
  return createPortal(
    <div className={styles['overlay']}>
      <div className={styles['animation']}>
        <Lottie animationData={food} loop={true} className={styles['animation']} />
      </div>

      <span className={styles['title']}>Loading...</span>
      <span className={styles['subtitle']}>잠시만 기다려주세요!</span>
    </div>,
    document.body
  );
}
