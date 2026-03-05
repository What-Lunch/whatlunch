'use client';

import React, { useEffect, useState } from 'react';
import { Clock as ClockIcon } from 'lucide-react';

import { getBeforeLunchMessage, getAfterLunchMessage, getDinnerTimeMessage } from './clockMessages';

import styles from './Clock.module.scss';

const LUNCH_TIME = { hour: 12, minute: 0 };
const DINNER_TIME = { hour: 18, minute: 0 };

type MealPhase = 'beforeLunch' | 'afterLunch' | 'dinnerTime';

function getMealPhase(): MealPhase {
  const now = new Date();

  const lunch = new Date();
  lunch.setHours(LUNCH_TIME.hour, LUNCH_TIME.minute, 0, 0);

  const dinner = new Date();
  dinner.setHours(DINNER_TIME.hour, DINNER_TIME.minute, 0, 0);

  if (now < lunch) return 'beforeLunch';
  if (now < dinner) return 'afterLunch';
  return 'dinnerTime';
}

function calcRemain() {
  const now = new Date();

  const lunch = new Date();
  lunch.setHours(LUNCH_TIME.hour, LUNCH_TIME.minute, 0, 0);

  const diff = lunch.getTime() - now.getTime();

  if (diff <= 0) return 'passed';

  const h = String(Math.floor(diff / 1000 / 60 / 60)).padStart(2, '0');
  const m = String(Math.floor(diff / 1000 / 60) % 60).padStart(2, '0');
  const s = String(Math.floor(diff / 1000) % 60).padStart(2, '0');

  return `${h}:${m}:${s}`;
}

function formatCurrentTime(date: Date) {
  const h = String(date.getHours()).padStart(2, '0');
  const m = String(date.getMinutes()).padStart(2, '0');
  const s = String(date.getSeconds()).padStart(2, '0');

  return `${h}:${m}:${s}`;
}

export default function Clock() {
  const [currentTime, setCurrentTime] = useState('');
  const [message, setMessage] = useState('');
  const [phase, setPhase] = useState<MealPhase | null>(null);

  useEffect(() => {
    const tick = () => {
      const now = new Date();
      const nextRemain = calcRemain();
      const nextPhase = getMealPhase();

      setCurrentTime(formatCurrentTime(now));

      if (phase !== nextPhase) {
        setPhase(nextPhase);
      }

      if (nextPhase === 'beforeLunch') {
        setMessage(getBeforeLunchMessage(nextRemain));
      } else if (nextPhase === 'afterLunch') {
        setMessage(getAfterLunchMessage());
      } else {
        setMessage(getDinnerTimeMessage());
      }
    };

    tick();
    const interval = setInterval(tick, 1000);

    return () => clearInterval(interval);
  }, [phase]);

  const isLoading = !currentTime;

  return (
    <section className={styles['clock']}>
      <div className={styles['clock__wrapper']}>
        <div className={styles['clock__header']}>
          <span className={styles['clock__message']}>
            {isLoading ? '시간을 확인하는 중...' : message}
          </span>
        </div>

        <div className={styles['clock__time-wrap']}>
          <ClockIcon className={styles['clock__icon']} aria-hidden="true" />

          <span
            className={`${styles['clock__time']} ${
              isLoading ? styles['clock__time--skeleton'] : ''
            }`}
          >
            {isLoading ? '00:00:00' : currentTime}
          </span>
        </div>
      </div>
    </section>
  );
}
