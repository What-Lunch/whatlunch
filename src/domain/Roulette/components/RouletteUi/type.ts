export interface RouletteUiProps {
  items: string[];
  onResult?: (item: string) => void;
  onStart?: () => void;
  size?: number;
}
export interface UseRouletteSpinProps {
  items: string[];
  angle: number;
  setAngle: React.Dispatch<React.SetStateAction<number>>;
  spinning: boolean;
  setSpinning: React.Dispatch<React.SetStateAction<boolean>>;
  onResult?: (v: string) => void;
  onStart?: () => void;
}
