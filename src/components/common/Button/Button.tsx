'use client';

import React from 'react';
import styles from './Button.module.scss';
import { ButtonProps } from './types';

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

  const variantClass = styles[`button--${variant}`];
  const modeClass = mode === 'outline' ? styles['button--outline'] : '';
  const sizeClass = size ? styles[`button--${size}`] : '';
  const disabledClass = disabled ? styles['button--disabled'] : '';

  const classes = [base, variantClass, modeClass, sizeClass, disabledClass, className]
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
