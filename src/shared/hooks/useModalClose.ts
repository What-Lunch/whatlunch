import { useEffect } from 'react';

/**
 * 모달 바깥 클릭 시 닫기 훅
 * const { handleOverlayClick } = useModalClose(onClose);
 * @param onClose
 */
export function useModalClose(onClose: () => void) {
  const handleOverlayClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  return { handleOverlayClick };
}

/**
 * Esc 키 눌렀을 때 모달 닫기 훅
 * useEscClose(onClose);
 * @param onClose
 */
export function useEscClose(onClose: () => void) {
  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };
    window.addEventListener('keydown', handleEsc);
    return () => window.removeEventListener('keydown', handleEsc);
  }, [onClose]);
}
