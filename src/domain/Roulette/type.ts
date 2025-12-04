export interface RouletteProps {
  isSpinning: boolean;
  onSpinStart: () => void;
  onSpinResult: (menu: string) => void;
}
