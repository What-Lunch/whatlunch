export interface FilterOption<T extends string> {
  value: T;
  label: string;
  icon: React.ReactNode;
  isActive: boolean;
}
