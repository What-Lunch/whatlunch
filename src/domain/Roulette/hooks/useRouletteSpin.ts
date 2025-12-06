import { calcSectorIndex } from '../utils/calcSectorIndex';
import { UseRouletteSpinProps } from '../components/RouletteUi/type';

export function useRouletteSpin({
  items,
  angle,
  setAngle,
  spinning,
  setSpinning,
  onResult,
  onStart,
}: UseRouletteSpinProps) {
  const spin = () => {
    if (spinning || items.length === 0) return;

    setSpinning(true);
    onStart?.();

    if (items.length === 1) {
      setTimeout(() => {
        setSpinning(false);
        onResult?.(items[0]);
      }, 500);
      return;
    }

    // 무작위 랜덤 계산
    let currentAngle = angle + Math.random() * Math.PI * 2;
    let velocity = 0;
    const maxVelocity = 1.1;
    const acceleration = 0.06;
    const friction = 0.985;
    let phase: 'accel' | 'decel' = 'accel';

    const interval = setInterval(() => {
      if (phase === 'accel') {
        velocity += acceleration;
        if (velocity >= maxVelocity) phase = 'decel';
      } else {
        velocity *= friction;

        if (velocity < 0.002) {
          clearInterval(interval);
          setSpinning(false);

          const index = calcSectorIndex(currentAngle, items.length);
          onResult?.(items[index]);
          return;
        }
      }

      currentAngle += velocity;
      setAngle(currentAngle);
    }, 16);
  };

  return spin;
}
