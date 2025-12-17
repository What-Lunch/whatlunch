import { BaseInputProps } from '../BaseInput/BaseInput.types';
import React from 'react';

export interface SearchInputProps extends Omit<BaseInputProps, 'value'> {
  value: string;
  onSearch: (value: string) => void;
  onClear?: () => void;
  searchIcon?: React.ReactNode;
  clearIcon?: React.ReactNode;
}
