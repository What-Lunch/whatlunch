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
  padding,
  fontSize,
  className = '',
  children,
  onClick,
  style,
  ...rest
}: ButtonProps) {
  const classes = [
    styles.button,
    styles[`button--${variant}`],
    styles[`button--${mode}`],
    size && styles[`button--${size}`],
    disabled && styles['button--disabled'],
    className,
  ]
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

  const finalStyle = {
    padding,
    fontSize,
    ...style,
  };

  return (
    <button
      type={type}
      className={classes}
      disabled={disabled}
      onClick={handleClick}
      style={finalStyle}
      {...rest}
    >
      {children}
    </button>
  );
}
