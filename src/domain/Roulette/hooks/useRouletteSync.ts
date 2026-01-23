import { useCallback } from 'react';

interface UseRoutetteSyncProps {
  angle: number;
  setAngle: (angle: number) => void;
  setSpinning: (spinning: boolean) => void;
  onResult: (item: Menu.GetMenuRes) => void;
  items: Menu.GetMenuRes[];
}

/**
 * 서버에서 받은 회전 각도와 시간으로 정확한 애니메이션 동기화
 */
export function useRouletteSync({ angle, setAngle, setSpinning, onResult }: UseRoutetteSyncProps) {
  const startSyncedSpin = useCallback(
    (finalRotation: number, duration: number, result: Menu.GetMenuRes) => {
      setSpinning(true);

      const startTime = Date.now();
      const startAngle = angle;

      const animate = () => {
        const elapsed = Date.now() - startTime;
        const progress = Math.min(elapsed / duration, 1);

        // easeOutCubic 이징
        const easeProgress = 1 - Math.pow(1 - progress, 3);

        // 현재 각도 계산
        const currentAngle = startAngle + (finalRotation - startAngle) * easeProgress;
        setAngle(currentAngle);

        if (progress < 1) {
          requestAnimationFrame(animate);
        } else {
          // 애니메이션 완료
          setAngle(finalRotation % 360);
          setSpinning(false);
          onResult(result);
        }
      };

      requestAnimationFrame(animate);
    },
    [angle, setAngle, setSpinning, onResult]
  );

  return { startSyncedSpin };
}
