'use client';

import React from 'react';
import styles from './Button.module.scss';

type Variant = 'primary' | 'secondary' | 'danger';
type Mode = 'fill' | 'outline';
type Size = 'sm' | 'md' | 'lg' | null;
type ButtonType = 'button' | 'submit' | 'reset';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Variant;
  mode?: Mode;
  size?: Size;
  type?: ButtonType;
  className?: string;
  children: React.ReactNode;
}

export default function Button({
  variant = 'primary',
  mode = 'fill',
  size = 'md',
  type = 'button',
  disabled = false,
  className = '',
  children,
  onClick,
  ...rest
}: ButtonProps) {
  const base = styles.button;

  const variantClass =
    mode === 'outline' ? styles[`button__${variant}__outline`] : styles[`button__${variant}`];

  // size가 null이면 sizeClass를 적용하지 않음
  const sizeClass = size ? styles[`button__${size}`] : '';

  const disabledClass = disabled ? styles['button__disabled'] : '';

  const classes = [base, variantClass, sizeClass, disabledClass, className]
    .filter(Boolean)
    .join(' ');

  const handleClick: React.MouseEventHandler<HTMLButtonElement> = e => {
    if (disabled) {
      e.preventDefault();
      e.stopPropagation();
      return;
    }
    onClick?.(e);
  };

  return (
    <button type={type} className={classes} disabled={disabled} onClick={handleClick} {...rest}>
      {children}
    </button>
  );
}
