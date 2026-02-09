'use client';

import { useCallback, useEffect, useState } from 'react';
import { Check, Utensils } from 'lucide-react';
import Image from 'next/image';
import { toast } from 'react-toastify';

import Modal from '@/shared/components/Modal';
import { addFoodDot, removeFoodDot } from '@/app/services/backend/users.api';
import { FOOD_DOTS } from '@/domain/Mypage/constants/foodDots';
import { useFoodDotStore } from '@/domain/Mypage/store/foodDot.store';

import styles from './FoodDotSelectionCard.module.scss';

interface FoodDotSelectionCardProps {
  initialSelectedDotIds: string[];
}

export default function FoodDotSelectionCard({ initialSelectedDotIds }: FoodDotSelectionCardProps) {
  const { selectedDotIds, setSelectedDotIds, toggleDotId } = useFoodDotStore();
  const [isModalOpen, setIsModalOpen] = useState(false);

  // 서버 초기값 동기화
  useEffect(() => {
    const current = useFoodDotStore.getState().selectedDotIds;

    const isSame =
      current.length === initialSelectedDotIds.length &&
      current.every(id => initialSelectedDotIds.includes(id));

    if (isSame) return;

    setSelectedDotIds(initialSelectedDotIds);
  }, [initialSelectedDotIds, setSelectedDotIds]);

  const handleToggleDot = async (dotId: string) => {
    const { selectedDotIds: before } = useFoodDotStore.getState();
    const wasSelected = before.includes(dotId);

    const { blocked } = toggleDotId(dotId);

    if (blocked) {
      toast.info('음식 뱃지는 최대 9개까지 선택할 수 있어요');
      return;
    }

    try {
      const nextDotIds = wasSelected ? await removeFoodDot(dotId) : await addFoodDot(dotId);

      // 서버 기준으로 최종 동기화
      setSelectedDotIds(nextDotIds);
    } catch {
      // 실패 시 다시 토글하여 롤백
      toggleDotId(dotId);
      toast.error('선택 저장에 실패했어요');
    }
  };

  const selectedDots = selectedDotIds
    .map(id => FOOD_DOTS.find(dot => dot.id === id))
    .filter((dot): dot is (typeof FOOD_DOTS)[number] => Boolean(dot));

  const handleOpenModal = useCallback(() => setIsModalOpen(true), []);
  const handleCloseModal = useCallback(() => setIsModalOpen(false), []);

  return (
    <>
      <section className={styles['food-dot-card']} aria-label="음식 뱃지 선택">
        <header className={styles['food-dot-card__header']}>
          <h2 className={styles['food-dot-card__title']}>음식 뱃지 선택</h2>
          <p className={styles['food-dot-card__desc']}>
            최대 9개까지 선택할 수 있어요 ({selectedDotIds.length}/9)
          </p>
        </header>

        {selectedDotIds.length > 0 ? (
          <ul className={styles['food-dot-card__list']}>
            {selectedDots.map(dot => (
              <li key={dot.id} className={styles['food-dot-card__item']}>
                <div className={styles['food-dot-card__selected']}>
                  <Image
                    src={dot.src}
                    alt={dot.label}
                    width={40}
                    height={40}
                    className={styles['food-dot-card__selected-img']}
                  />
                  <span className={styles['food-dot-card__label']}>{dot.label}</span>
                </div>
              </li>
            ))}
          </ul>
        ) : (
          <div className={styles['food-dot-card__empty']}>
            <Utensils size={32} strokeWidth={1.5} aria-hidden />
            <p>아직 선택한 뱃지가 없어요</p>
          </div>
        )}

        <div className={styles['food-dot-card__footer']}>
          <button
            type="button"
            className={styles['food-dot-card__view-all']}
            onClick={handleOpenModal}
          >
            {selectedDotIds.length > 0 ? '편집하기' : '뱃지 고르기'}
          </button>
        </div>
      </section>

      {isModalOpen && (
        <Modal
          isOpen={isModalOpen}
          onClose={handleCloseModal}
          title={`음식 뱃지 전체 보기 (${selectedDotIds.length}/9)`}
          innerClassName={styles['food-dot-modal']}
        >
          <ul className={styles['food-dot-modal__list']}>
            {FOOD_DOTS.map(dot => (
              <li key={dot.id} className={styles['food-dot-modal__item']}>
                <button
                  type="button"
                  className={styles['food-dot-modal__button']}
                  onClick={() => handleToggleDot(dot.id)}
                  aria-pressed={selectedDotIds.includes(dot.id)}
                >
                  <Image src={dot.src} alt={dot.label} width={56} height={56} />
                  {selectedDotIds.includes(dot.id) && (
                    <span className={styles['food-dot-modal__check']}>
                      <Check size={18} />
                    </span>
                  )}
                </button>
              </li>
            ))}
          </ul>
        </Modal>
      )}
    </>
  );
}
