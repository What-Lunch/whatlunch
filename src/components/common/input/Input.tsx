'use client';

import { useState } from 'react';
import styles from './Input.module.scss';

import { InputProps } from './Input.types';

export default function Input({
  value,
  onChange,
  isError = false,
  errorMessage,
  icon,
  iconPosition = 'right',
  disabled,
  onIconClick,
  ...rest
}: InputProps) {
  const [isFocused, setIsFocused] = useState(false);

  const handleFocus = () => setIsFocused(true);
  const handleBlur = () => setIsFocused(false);

  return (
    <div className={styles.container}>
      <div
        className={[
          styles.wrapper,
          isFocused ? styles.focused : '',
          isError ? styles.error : '',
          disabled ? styles.disabled : '',
          icon ? styles[`icon-${iconPosition}`] : '',
        ].join(' ')}
      >
        {icon && (
          <button
            type="button"
            className={styles[`icon-${iconPosition}`]}
            disabled={disabled}
            onClick={onIconClick}
            aria-label="icon-button"
          >
            {icon}
          </button>
        )}

        <input
          className={styles.input}
          value={value}
          onChange={onChange}
          disabled={disabled}
          onFocus={handleFocus}
          onBlur={handleBlur}
          {...rest} // placeholder, type 등 나머지 기본 input 속성
        />
      </div>

      {isError && errorMessage && <p className={styles.errorMessage}>{errorMessage}</p>}
    </div>
  );
}
