import React from 'react';

// Variant 리스트를 const 배열로 관리
export const VARIANTS = ['primary', 'secondary', 'tertiary', 'neutral', 'blue', 'danger'] as const;
export type Variant = (typeof VARIANTS)[number];

export const SIZES = ['sm', 'md', 'lg'] as const;
export type Size = (typeof SIZES)[number];

export type Mode = 'fill' | 'outline';
export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Variant;
  mode?: Mode;
  size?: Size;
  padding?: string;
  fontSize?: string;
  className?: string;
  children: React.ReactNode;
}
