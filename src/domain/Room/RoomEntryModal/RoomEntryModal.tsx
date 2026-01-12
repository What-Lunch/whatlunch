'use client';

import { ArrowLeft, LogIn, UserPlus, X } from 'lucide-react';
import type { RoomEntryStep } from '../hooks/useRoomEntry';

import styles from './RoomEntryModal.module.scss';

interface Props {
  step: RoomEntryStep; // 'select' | 'join'
  roomCode: string;
  error: string;
  isJoining: boolean;
  onCreate: () => void;
  onJoinSelect: () => void;
  onBack: () => void;
  onClose: () => void;
  onChangeCode: (value: string) => void;
}

export default function RoomEntryModal({
  step,
  roomCode,
  error,
  isJoining,
  onCreate,
  onJoinSelect,
  onBack,
  onClose,
  onChangeCode,
}: Props) {
  return (
    <div className={styles['room-entry-modal']} role="dialog" aria-modal="true">
      <div className={styles['room-entry-modal__backdrop']} onClick={onClose} />

      <div className={styles['room-entry-modal__content']}>
        <header className={styles['room-entry-modal__header']}>
          {step === 'join' ? (
            <button type="button" className={styles['room-entry-modal__back']} onClick={onBack}>
              <ArrowLeft size={18} />
            </button>
          ) : (
            <span />
          )}

          <h3 className={styles['room-entry-modal__title']}>같이 정하기</h3>

          <button type="button" className={styles['room-entry-modal__close']} onClick={onClose}>
            <X size={20} />
          </button>
        </header>

        {step === 'select' && (
          <div className={styles['room-entry-modal__options']}>
            <button
              type="button"
              className={styles['room-entry-modal__option--primary']}
              onClick={onCreate}
            >
              <span className={styles['room-entry-modal__option-icon']}>
                <UserPlus size={20} />
              </span>
              <div>
                <strong>방 만들기</strong>
                <span>새 방을 만들고 친구에게 방 코드를 공유해요</span>
              </div>
            </button>

            <button
              type="button"
              className={styles['room-entry-modal__option--secondary']}
              onClick={onJoinSelect}
            >
              <span className={styles['room-entry-modal__option-icon']}>
                <LogIn size={20} />
              </span>
              <div>
                <strong>방 코드로 입장하기</strong>
                <span>친구에게 받은 코드를 입력해요</span>
              </div>
            </button>
          </div>
        )}

        {step === 'join' && (
          <div className={styles['room-entry-modal__join']}>
            <input
              type="text"
              autoComplete="off"
              className={styles['room-entry-modal__input']}
              value={roomCode}
              onChange={e => onChangeCode(e.target.value)}
              placeholder="예: ABCD12"
              autoFocus
            />

            {error && <p className={styles['room-entry-modal__error']}>{error}</p>}

            {isJoining && <p className={styles['room-entry-modal__loading']}>입장 중이에요…</p>}
          </div>
        )}
      </div>
    </div>
  );
}
