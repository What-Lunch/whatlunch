export interface RouletteControllerProps {
  isSpinning: boolean;
  onSpinStart: () => void;
  onSpinResult: (item: string) => void;
  result: string | null;
}
