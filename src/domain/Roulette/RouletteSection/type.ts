export interface RouletteSectionProps {
  isSpinning: boolean;
  onSpinStart: () => void;
  onSpinResult: (menu: string) => void;
}
