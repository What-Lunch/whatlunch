'use client';

import RoomTabs from '@/shared/components/RoomTabs';
import styles from './page.module.scss';

export default function SoloRoomPage() {
  return (
    <div className={styles['solo']}>
      <header className={styles['solo__header']}>
        <h1 className={styles['solo__title']}>혼자 메뉴 정하기</h1>
        <p className={styles['solo__description']}>로그인 없이 바로 메뉴를 추천받아보세요</p>
      </header>

      <main className={styles['solo__content']}>
        <RoomTabs />
      </main>
    </div>
  );
}
