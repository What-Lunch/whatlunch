'use client';

import styles from './ResultModal.module.scss';

interface Props {
  menu: string;
  onClose: () => void;
}

export default function ResultModal({ menu, onClose }: Props) {
  const MENU_IMAGES: Record<string, string> = {
    부대찌개: '/foods/food.jpg',
    닭개장: '/foods/food.jpg',
    동태찌개: '/foods/food.jpg',
    감자탕: '/foods/food.jpg',
  };

  const image = MENU_IMAGES[menu];

  const share = async () => {
    if (!navigator.share) {
      alert('공유 기능을 지원하지 않는 브라우저입니다.');
      return;
    }

    try {
      await navigator.share({
        title: '오늘의 메뉴',
        text: `오늘의 메뉴는 ${menu}입니다!`,
      });
    } catch (err) {
      if (err instanceof DOMException && err.name === 'AbortError') {
        console.log('사용자가 공유를 취소했습니다.');
        return;
      }

      console.error('공유 중 오류 발생:', err);
      alert('공유 중 문제가 발생했습니다.');
    }
  };

  return (
    <div className={styles['overlay']} onClick={onClose}>
      <div
        className={styles['modal']}
        onClick={e => e.stopPropagation()}
        role="dialog"
        aria-modal="true"
      >
        {image && <img className={styles['modal__image']} src={image} alt={menu} />}

        <p className={styles['modal__name']}>{menu}</p>

        <div className={styles['modal__buttons']}>
          <button onClick={share}>공유하기</button>
          <button>자세히 보기</button>
          <button className={styles['modal__close-btn']} onClick={onClose}>
            닫기
          </button>
        </div>
      </div>
    </div>
  );
}
