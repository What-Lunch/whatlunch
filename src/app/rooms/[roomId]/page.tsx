'use client';

import { Copy, Check } from 'lucide-react';

import Chat from '@/domain/Chat';
import RoomTabs from '@/shared/components/RoomTabs';
import { useRoomLogic } from './useRoomLogic';

import styles from './page.module.scss';

type Props = {
  params: { roomId: string };
};

export default function RoomPage({ params }: Props) {
  const roomId = params.roomId;

  const { isSoloMode, isValidRoom, copied, copyRoomCode } = useRoomLogic(roomId);

  if (isValidRoom === null) {
    return <div className={styles['room__loading']}>방 정보를 확인 중입니다</div>;
  }

  return (
    <div className={styles['room']}>
      <header className={styles['room__header']}>
        <h1 className={styles['room__title']}>
          {isSoloMode ? '혼자 메뉴 정하기' : '같이 메뉴 정하기'}
        </h1>

        {!isSoloMode && (
          <div className={styles['room__code']}>
            <span className={styles['room__code__label']}>방 코드</span>
            <strong className={styles['room__code__value']}>{roomId}</strong>

            <button
              aria-label="방 코드 복사"
              className={styles['room__code__copy']}
              onClick={copyRoomCode}
            >
              {copied ? <Check size={16} /> : <Copy size={16} />}
              {copied ? '복사됨' : '복사'}
            </button>
          </div>
        )}
      </header>

      <div className={styles['room__content']}>
        <main className={styles['room__left']}>
          <RoomTabs />
        </main>

        {!isSoloMode && (
          <aside className={styles['room__right']}>
            <Chat />
          </aside>
        )}
      </div>
    </div>
  );
}
