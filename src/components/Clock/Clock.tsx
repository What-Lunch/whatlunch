'use client';

import React, { useEffect, useState } from 'react';
import styles from './Clock.module.scss';
import { getBeforeLunchMessage, getAfterLunchMessage } from './clockMessages';

const LUNCH_TIME = { hour: 12, minute: 0, second: 0 };

function calcRemain() {
  const now = new Date();
  const lunch = new Date();
  lunch.setHours(LUNCH_TIME.hour, LUNCH_TIME.minute, LUNCH_TIME.second, 0);

  const diff = lunch.getTime() - now.getTime();

  if (diff <= 0) return 'passed';

  const h = String(Math.floor(diff / 1000 / 60 / 60)).padStart(2, '0');
  const m = String(Math.floor(diff / 1000 / 60) % 60).padStart(2, '0');
  const s = String(Math.floor(diff / 1000) % 60).padStart(2, '0');

  return `${h}:${m}:${s}`;
}

// 브라우저에 영향받지 않는 고정 HH:mm:ss 포맷
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

  // 메시지 갱신
  useEffect(() => {
    if (message) return;

    if (remain === '') return;

    if (remain === 'passed') {
      setMessage(getAfterLunchMessage());
    } else if (remain !== '') {
      setMessage(getBeforeLunchMessage(remain));
    }
  }, [remain, message]);

  return (
    <div className={styles[`container`]}>
      <div className={styles[`wrapper`]}>
        <span className={styles[`text`]}>{message}</span>
        <span className={styles[`time`]}>{currentTime}</span>
      </div>
    </div>
  );
}
