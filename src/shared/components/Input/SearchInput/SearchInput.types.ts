import { BaseInputProps } from '../BaseInput/BaseInput.types';

export interface SearchInputProps extends BaseInputProps {
  onSearch: (value: string) => void;
  searchIcon?: React.ReactNode;
  clearIcon?: React.ReactNode;
}