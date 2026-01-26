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
  if (now >= lunch && now < dinner) return 'afterLunch';
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
  const [remain, setRemain] = useState('');
  const [message, setMessage] = useState('');
  const [phase, setPhase] = useState<MealPhase | null>(null);

  useEffect(() => {
    const tick = () => {
      const now = new Date();
      setCurrentTime(formatCurrentTime(now));
      setRemain(calcRemain());
    };

    tick();
    const interval = setInterval(tick, 1000);
    return () => clearInterval(interval);
  }, []);

  // 상태 변화 시 메시지 1회 설정
  useEffect(() => {
    if (!remain) return;

    const nextPhase = getMealPhase();
    if (phase === nextPhase) return;

    let nextMessage = '';

    if (nextPhase === 'beforeLunch') {
      nextMessage = getBeforeLunchMessage(remain);
    }

    if (nextPhase === 'afterLunch') {
      nextMessage = getAfterLunchMessage();
    }

    if (nextPhase === 'dinnerTime') {
      nextMessage = getDinnerTimeMessage();
    }

    setPhase(nextPhase);
    setMessage(nextMessage);
  }, [remain, phase]);

  return (
    <section className={styles['clock']}>
      <div className={styles['clock__wrapper']}>
        <div className={styles['clock__header']}>
          <span className={styles['clock__message']}>{message}</span>
        </div>

        <div className={styles['clock__time-wrap']}>
          <ClockIcon className={styles['clock__icon']} aria-hidden="true" />
          <span className={styles['clock__time']}>{currentTime}</span>
        </div>
      </div>
    </section>
  );
}
