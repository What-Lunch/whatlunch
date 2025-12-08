// 룰렛 동작을 제어하는 상위 컨테이너의 Props
export interface RouletteControllerProps {
  isSpinning: boolean;
  onSpinStart: () => void;
  onSpinResult: (item: string) => void;
}
