'use client';

import { Eye, EyeOff } from 'lucide-react';

import { useState } from 'react';
import styles from './FormInput.module.scss';

import { FormInputProps } from './FormInput.types';

export default function FormInput({
  type, // email 혹은 password

  value,
  onChange,

  isError = false,
  errorMessage,

  showToggle = true,
  disabled = false,

  placeholder,
  ...rest
}: FormInputProps) {
  const [isFocused, setIsFocused] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const handleFocus = () => setIsFocused(true);
  const handleBlur = () => setIsFocused(false);

  const wrapperClass = [
    styles['wrapper'],
    styles[`wrapper--${type}`],
    isFocused ? styles['focused'] : '',
    isError ? styles['error'] : '',
    disabled ? styles['disabled'] : '',
  ].join(' ');

  const showToggleButton = type === 'password' && showToggle;

  return (
    <div className={styles['container']}>
      <div className={wrapperClass}>
        <input
          className={styles['input']}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          disabled={disabled}
          onFocus={handleFocus}
          onBlur={handleBlur}
          placeholder={placeholder}
          type={
            type === 'password'
              ? (showPassword ? 'text' : 'password')
              : 'text'
          }
          {...rest}
        />

        {showToggleButton && (
          <button
            type="button"
            className={styles['wrapper__icon-right']}
            onClick={() => setShowPassword((prev) => !prev)}
            disabled={disabled}
            aria-label="toggle-password"
          >
            {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
          </button>
        )}
      </div>

      {isError && errorMessage && (
        <p className={styles['errorMessage']}>{errorMessage}</p>
      )}
    </div>
  );
}