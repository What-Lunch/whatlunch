'use client';

import { useState, useMemo } from 'react';
import { Check, Utensils } from 'lucide-react';
import { useQuery, useQueryClient, useMutation } from '@tanstack/react-query';
import Image from 'next/image';
import { toast } from 'react-toastify';

import Modal from '@/shared/components/Modal';
import { addFoodDot, getMyFoodDots, removeFoodDot } from '@/services/backend/users.api';
import { FOOD_DOTS } from '@/features/Mypage/constants/foodDots';

import styles from './FoodDotSelectionCard.module.scss';

const MAX_FOOD_DOTS = 9;
const FOOD_DOTS_QUERY_KEY = ['foodDots'] as const;

function useFoodDots() {
  const queryClient = useQueryClient();

  const { data: foodDotIds = [] } = useQuery({
    queryKey: FOOD_DOTS_QUERY_KEY,
    queryFn: getMyFoodDots,
  });

  // 공통 낙관적 업데이트 핸들러
  const handleOptimisticUpdate = async (updateFn: (current: string[]) => string[]) => {
    await queryClient.cancelQueries({ queryKey: FOOD_DOTS_QUERY_KEY });
    const previousDotIds = queryClient.getQueryData<string[]>(FOOD_DOTS_QUERY_KEY) ?? [];

    queryClient.setQueryData<string[]>(FOOD_DOTS_QUERY_KEY, (current = []) => updateFn(current));

    return { previousDotIds };
  };

  const handleError = (
    _error: Error,
    _variables: string,
    context?: { previousDotIds: string[] }
  ) => {
    if (context?.previousDotIds) {
      queryClient.setQueryData(FOOD_DOTS_QUERY_KEY, context.previousDotIds);
    }
    toast.error('선택 저장에 실패했어요');
  };

  const { mutate: addDot } = useMutation({
    mutationFn: addFoodDot,
    onMutate: dotId =>
      handleOptimisticUpdate(current => (current.includes(dotId) ? current : [...current, dotId])),
    onError: handleError,
  });

  const { mutate: removeDot } = useMutation({
    mutationFn: removeFoodDot,
    onMutate: dotId => handleOptimisticUpdate(current => current.filter(id => id !== dotId)),
    onError: handleError,
  });

  return { foodDotIds, addDot, removeDot };
}

// 메인 컴포넌트
export default function FoodDotSelectionCard() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { foodDotIds, addDot, removeDot } = useFoodDots();

  // useMemo를 통한 불필요한 연산 방지
  const selectedDots = useMemo(() => {
    return foodDotIds
      .map(id => FOOD_DOTS.find(dot => dot.id === id))
      .filter((dot): dot is (typeof FOOD_DOTS)[number] => Boolean(dot));
  }, [foodDotIds]);

  const handleToggleDot = (dotId: string) => {
    const isSelected = foodDotIds.includes(dotId);

    if (!isSelected && foodDotIds.length >= MAX_FOOD_DOTS) {
      toast.info(`음식 뱃지는 최대 ${MAX_FOOD_DOTS}개까지 선택할 수 있어요`);
      return;
    }

    if (isSelected) {
      removeDot(dotId);
    } else {
      addDot(dotId);
    }
  };

  return (
    <>
      <section className={styles['food-dot-card']} aria-label="음식 뱃지 선택">
        <header className={styles['food-dot-card__header']}>
          <h2 className={styles['food-dot-card__title']}>음식 뱃지 선택</h2>
          <p className={styles['food-dot-card__desc']}>
            최대 {MAX_FOOD_DOTS}개까지 선택할 수 있어요 ({foodDotIds.length}/{MAX_FOOD_DOTS})
          </p>
        </header>

        {foodDotIds.length > 0 ? (
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
            onClick={() => setIsModalOpen(true)}
          >
            {foodDotIds.length > 0 ? '편집하기' : '뱃지 고르기'}
          </button>
        </div>
      </section>

      {isModalOpen && (
        <Modal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          title={`음식 뱃지 전체 보기 (${foodDotIds.length}/${MAX_FOOD_DOTS}) 🥐`}
          description="좋아하는 음식 뱃지를 클릭해보세요!"
          innerClassName={styles['food-dot-modal']}
        >
          <ul className={styles['food-dot-modal__list']}>
            {FOOD_DOTS.map(dot => {
              const isSelected = foodDotIds.includes(dot.id);

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
