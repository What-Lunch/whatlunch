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

  const share = () => {
    if (navigator.share) {
      navigator.share({
        title: '오늘의 메뉴',
        text: `오늘의 메뉴는 ${menu}입니다!`,
      });
    } else {
      alert('공유 기능을 지원하지 않는 브라우저입니다.');
    }
  };

  return (
    <div className={styles.overlay}>
      <div className={styles.modal}>
        {/* 메뉴 이미지 */}
        {image && <img className={styles.menuImage} src={image} alt={menu} />}

        <h2>🍽️ 오늘의 메뉴!</h2>
        <p className={styles.menuName}>{menu}</p>

        <div className={styles.buttons}>
          <button onClick={share}>공유하기</button>
          <button onClick={() => alert(`${menu} 상세 페이지 준비중입니다!`)}>자세히 보기</button>
          <button onClick={onClose} className={styles.closeBtn}>
            닫기
          </button>
        </div>
      </div>
    </div>
  );
}
