export interface RouletteUiProps {
  items: string[];
  onResult?: (item: string) => void;
  onStart?: () => void;
  size?: number;
}
