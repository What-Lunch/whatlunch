'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { User, Users } from 'lucide-react';

import Button from '@/shared/components/Button/Button';
import { useRoomEntry } from '../hooks/useRoomEntry';
import RoomEntryModal from '../RoomEntryModal/RoomEntryModal';

import styles from './RoomEntryCard.module.scss';

type Mode = 'together' | 'solo';

export default function RoomEntryCard() {
  const router = useRouter();

  const [mode, setMode] = useState<Mode>('together');
  const [isModalOpen, setIsModalOpen] = useState(false);

  const room = useRoomEntry();

  return (
    <>
      <section className={styles['room-entry']} aria-label="메뉴 추천 방식 선택">
        <header className={styles['room-entry__header']}>
          <h2 className={styles['room-entry__header__title']}>같이 정해볼까요?</h2>
          <p className={styles['room-entry__header__description']}>정하는 방법을 선택해보세요</p>
        </header>

        <div className={styles['room-entry__tabs']} aria-label="같이 정하기 또는 혼자 정하기 선택">
          <button
            className={`${styles['room-entry__tab']} ${
              mode === 'together' ? styles['room-entry__tab--active'] : ''
            }`}
            aria-label="친구들과 같이 메뉴 정하기 선택"
            onClick={() => setMode('together')}
          >
            같이 정하기
          </button>

          <button
            className={`${styles['room-entry__tab']} ${
              mode === 'solo' ? styles['room-entry__tab--active'] : ''
            }`}
            aria-label="혼자서 메뉴 추천 받기 선택"
            onClick={() => setMode('solo')}
          >
            혼자 정하기
          </button>
        </div>

        {mode === 'together' && (
          <>
            <div
              className={styles['room-entry__description-box']}
              aria-label="같이 정하기 기능 설명"
            >
              <p className={styles['room-entry__description-box__main']}>
                친구들과 실시간으로 룰렛과 채팅을 할 수 있어요
              </p>
              <span className={styles['room-entry__description-box__sub']}>
                방을 만들면 6자리 코드가 생성돼요
              </span>
            </div>

            <Button
              variant="orange"
              size="lg"
              aria-label="같이 정하기 모달 열기"
              onClick={() => {
                setIsModalOpen(true);
                room.setStep('select');
              }}
            >
              <Users size={18} aria-hidden="true" />
              같이 정하기
            </Button>
          </>
        )}

        {mode === 'solo' && (
          <>
            <div
              className={styles['room-entry__description-box--solo']}
              aria-label="혼자 정하기 기능 설명"
            >
              로그인 없이 바로 메뉴를 추천받을 수 있어요
            </div>

            <Button
              variant="orange"
              size="lg"
              mode="outline"
              aria-label="혼자 메뉴 추천 받기 페이지로 이동"
              onClick={() => router.push('/rooms/solo')}
            >
              <User size={18} aria-hidden="true" />
              혼자 정하기
            </Button>
          </>
        )}
      </section>

      {isModalOpen && (
        <RoomEntryModal
          step={room.step}
          roomCode={room.roomCodeRaw}
          error={room.error}
          isJoining={room.isJoining}
          onCreate={room.createRoom}
          onJoinSelect={() => room.setStep('join')}
          onBack={room.resetJoin}
          onClose={() => setIsModalOpen(false)}
          onChangeCode={room.changeRoomCode}
        />
      )}
    </>
  );
}
