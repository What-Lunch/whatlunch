import React from 'react';

export type Variant = 'primary' | 'secondary' | 'tertiary' | 'gradient' | 'danger';
export type Mode = 'fill' | 'outline';
export type Size = 'sm' | 'md' | 'lg' | null;
export type ButtonType = 'button' | 'submit' | 'reset';

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Variant;
  mode?: Mode;
  size?: Size;
  type?: ButtonType;
  className?: string;
  children: React.ReactNode;
}
