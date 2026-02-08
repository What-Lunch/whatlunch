'use client';

import { useCallback, useEffect, useState } from 'react';
import { Check, Utensils } from 'lucide-react';
import Image from 'next/image';

import { toast } from 'react-toastify';

import Modal from '@/shared/components/Modal';
import { addFoodDot, removeFoodDot } from '@/app/services/backend/users.api';
import { FOOD_DOTS } from '@/domain/Mypage/constants/foodDots';
import { useFoodDotStore } from '@/domain/Mypage/store/foodDot.store';

import styles from './RecentMenuDecisionCard.module.scss';

// 최대 선택 가능 개수
const MAX_SELECTABLE = 9;

interface RecentMenuDecisionCardProps {
  initialSelectedDotIds: string[];
}

export default function RecentMenuDecisionCard({
  initialSelectedDotIds,
}: RecentMenuDecisionCardProps) {
  const { selectedDotIds, setSelectedDotIds, addDotId, removeDotId } = useFoodDotStore();
  const [isModalOpen, setIsModalOpen] = useState(false);

  // 서버에서 받아온 값
  useEffect(() => {
    setSelectedDotIds(initialSelectedDotIds);
  }, [initialSelectedDotIds, setSelectedDotIds]);

  const handleToggleDot = async (dotId: string) => {
    const isSelected = selectedDotIds.includes(dotId);

    // 프론트에서 개수 제한
    if (!isSelected && selectedDotIds.length >= MAX_SELECTABLE) {
      toast.info('음식 뱃지는 최대 9개까지 선택할 수 있어요');
      return;
    }

    // 즉시 반영
    if (isSelected) {
      removeDotId(dotId);
    } else {
      addDotId(dotId);
    }

    try {
      // 서버 반영
      if (isSelected) {
        await removeFoodDot(dotId);
      } else {
        await addFoodDot(dotId);
      }
    } catch {
      // 실패 시 롤백
      if (isSelected) {
        addDotId(dotId);
      } else {
        removeDotId(dotId);
      }
      toast.error('선택 저장에 실패했어요');
    }
  };

  const selectedCount = selectedDotIds.length;
  const selectedDots = selectedDotIds
    .map(id => FOOD_DOTS.find(dot => dot.id === id))
    .filter((dot): dot is (typeof FOOD_DOTS)[number] => dot !== undefined);

  const handleOpenModal = useCallback(() => setIsModalOpen(true), []);
  const handleCloseModal = useCallback(() => setIsModalOpen(false), []);

  return (
    <>
      <section className={styles['food-dot-card']} aria-label="음식 뱃지 선택">
        <header className={styles['food-dot-card__header']}>
          <h2 className={styles['food-dot-card__title']}>음식 뱃지 선택</h2>
          <p className={styles['food-dot-card__desc']}>
            최대 9개까지 선택할 수 있어요 ({selectedCount}/9)
          </p>
        </header>

        {selectedCount > 0 ? (
          <ul className={styles['food-dot-card__list']}>
            {selectedDots.map(dot => (
              <li key={dot.id} className={styles['food-dot-card__item']}>
                <div className={styles['food-dot-card__selected']}>
                  <Image src={dot.src} alt={dot.label} width={40} height={40} />
                  <span className={styles['food-dot-card__label']}>{dot.label}</span>
                </div>
              </li>
            ))}
          </ul>
        ) : (
          <div className={styles['food-dot-card__empty']}>
            <Utensils
              size={32}
              strokeWidth={1.5}
              className={styles['food-dot-card__empty-icon']}
              aria-hidden
            />
            <p>아직 선택한 뱃지가 없어요</p>
          </div>
        )}

        <div className={styles['food-dot-card__footer']}>
          <button
            type="button"
            className={styles['food-dot-card__view-all']}
            onClick={handleOpenModal}
          >
            {selectedCount > 0 ? '편집하기' : '뱃지 고르기'}
          </button>
        </div>
      </section>

      {/* 전체 도트 선택 모달 */}
      {isModalOpen && (
        <Modal
          isOpen={isModalOpen}
          onClose={handleCloseModal}
          title={`음식 뱃지 전체 보기 (${selectedCount}/9)`}
          innerClassName={styles['food-dot-modal']}
        >
          <ul className={styles['food-dot-modal__list']}>
            {FOOD_DOTS.map(dot => {
              const isSelected = selectedDotIds.includes(dot.id);

              return (
                <li key={dot.id} className={styles['food-dot-modal__item']}>
                  <button
                    type="button"
                    className={styles['food-dot-modal__button']}
                    onClick={() => handleToggleDot(dot.id)}
                    aria-pressed={isSelected}
                  >
                    <Image src={dot.src} alt={dot.label} width={56} height={56} />

                    {isSelected && (
                      <span className={styles['food-dot-modal__check']}>
                        <Check size={18} />
                      </span>
                    )}
                  </button>
                </li>
              );
            })}
          </ul>
        </Modal>
      )}
    </>
  );
}
