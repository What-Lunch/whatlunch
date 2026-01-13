import { InputHTMLAttributes, ChangeEvent, ReactNode } from 'react';

export interface BaseInputProps extends InputHTMLAttributes<HTMLInputElement> {
  onChange: (e: ChangeEvent<HTMLInputElement>) => void;
  children?: ReactNode;
  wrapperClassName?: string;
  'aria-invalid'?: boolean;
  'aria-describedby'?: string;
  disableFocusStyle?: boolean;
}
