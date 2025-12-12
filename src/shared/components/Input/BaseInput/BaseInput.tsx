'use client';

import { useState } from 'react';

import styles from './BaseInput.module.scss';

import { BaseInputProps } from './BaseInput.types';

export default function BaseInput({
  type = 'text',
  value,
  onChange,
  disabled = false,
  placeholder,
  wrapperClassName,
  children,
  ...rest
}: BaseInputProps) {
  const [isFocused, setIsFocused] = useState(false);

  const handleFocus = (e: React.FocusEvent<HTMLInputElement>) => {
    setIsFocused(true);
    if (rest.onFocus) {
      rest.onFocus(e);
    }
  };
  
  const handleBlur = (e: React.FocusEvent<HTMLInputElement>) => {
    setIsFocused(false);
    if (rest.onBlur) {
      rest.onBlur(e);
    }
  };

  const finalWrapperClass = [
    styles['wrapper'],
    isFocused ? styles['focused'] : '',
    disabled ? styles['disabled'] : '',
    wrapperClassName,
  ].filter(Boolean).join(' ');

  return (
    <div className={styles['container']}>
      <div className={finalWrapperClass}>
        <input
          className={styles['input']}
    
          {...rest}

          type={type}
          value={value}
          onChange={onChange}
          disabled={disabled}
          placeholder={placeholder}
          
          onFocus={handleFocus}
          onBlur={handleBlur}
        />
        {children}
      </div>
    </div>
  );
}