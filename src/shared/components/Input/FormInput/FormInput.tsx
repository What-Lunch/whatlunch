'use client';

import { useState } from 'react';

import { Eye, EyeOff } from 'lucide-react';

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
  const errorMessageId = `${rest.id || 'form-input'}-${type}-error-message`;

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
              : type
          }
          aria-invalid={isError} // 스크린 리더에 에러 상태 알림
          aria-describedby={isError ? errorMessageId : undefined} // 에러 메시지가 있을 때만 해당 ID 연결
          {...rest}
        />

        {showToggleButton && (
          <button
            type="button"
            className={styles['wrapper__icon-right']}
            onClick={() => setShowPassword((prev) => !prev)}
            disabled={disabled}
            aria-label={showPassword ? "Hide password" : "Show password"}
          >
            {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
          </button>
        )}
      </div>

      {isError && errorMessage && (
        <p id={errorMessageId} className={styles['errorMessage']}>
          {errorMessage}
        </p>
      )}
    </div>
  );
}