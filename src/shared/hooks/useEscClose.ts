import { useEffect, useRef } from 'react';

export function useEscClose(onClose?: () => void) {
  const onCloseRef = useRef(onClose);

  // 최신 onClose를 ref에 저장
  useEffect(() => {
    onCloseRef.current = onClose;
  }, [onClose]);

  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key !== 'Escape') return;

      // onClose 없으면 아무것도 하지 않음
      if (typeof onCloseRef.current === 'function') {
        onCloseRef.current();
      }
    };

    window.addEventListener('keydown', handleEsc);
    return () => window.removeEventListener('keydown', handleEsc);
  }, []);
}

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
