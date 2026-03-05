'use client';

import React, { useEffect, useState } from 'react';
import { Clock as ClockIcon } from 'lucide-react';

import {
  getBeforeLunchMessage,
  getAfterLunchMessage,
  getDinnerTimeMessage,
  loadingMessage,
} from './clockMessages';

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
  const [currentTime, setCurrentTime] = useState<string>('');
  const [message, setMessage] = useState(loadingMessage);
  const [phase, setPhase] = useState<MealPhase | null>(null);

  useEffect(() => {
    const tick = () => {
      const now = new Date();
      const nextRemain = calcRemain();
      const nextPhase = getMealPhase();

      setCurrentTime(formatCurrentTime(now));

      // 시간대가 바뀔 때만 메시지 갱신
      if (phase !== nextPhase) {
        setPhase(nextPhase);

        if (nextPhase === 'beforeLunch') {
          setMessage(getBeforeLunchMessage(nextRemain));
        } else if (nextPhase === 'afterLunch') {
          setMessage(getAfterLunchMessage());
        } else {
          setMessage(getDinnerTimeMessage());
        }
      }
    };

    tick();
    const interval = setInterval(tick, 1000);

    return () => clearInterval(interval);
  }, [phase]);

  return (
    <section className={styles['clock']}>
      <div className={styles['clock__wrapper']}>
        <div className={styles['clock__header']}>
          <span className={styles['clock__message']}>{message}</span>
        </div>

        {currentTime && (
          <div className={styles['clock__time-wrap']}>
            <ClockIcon className={styles['clock__icon']} aria-hidden="true" />
            <span className={styles['clock__time']}>{currentTime}</span>
          </div>
        )}
      </div>
    </section>
  );
}
