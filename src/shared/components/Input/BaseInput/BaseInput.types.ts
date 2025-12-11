
import { ChangeEvent, InputHTMLAttributes, ReactNode } from 'react';

export interface BaseInputProps extends Omit<InputHTMLAttributes<HTMLInputElement>, 'value'> {
  type?: HTMLInputElement['type']; 
  value: string;
  onChange: (e: ChangeEvent<HTMLInputElement>) => void; 
  wrapperClassName?: string;
  children?: ReactNode;
}