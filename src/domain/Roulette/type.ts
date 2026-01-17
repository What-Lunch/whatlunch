export interface RouletteControllerProps {
  isSpinning: boolean;
  onSpinStart: () => void;
  onSpinResult: (item: Menu.GetMenuRes) => void;
  result: Menu.GetMenuRes | null;
}
