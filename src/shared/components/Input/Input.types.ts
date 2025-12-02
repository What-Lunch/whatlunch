import React, { InputHTMLAttributes, ReactNode } from 'react';

export interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;

  isError?: boolean;
  errorMessage?: string;

  icon?: ReactNode;
  iconPosition?: 'left' | 'right';
  onIconClick?: () => void;
}
