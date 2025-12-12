'use client';

import { useState, useId } from 'react';
import { Eye, EyeOff } from 'lucide-react';

import BaseInput from '../BaseInput/BaseInput';
import { FormFieldProps } from './FormField.types';
import styles from './FormField.module.scss';

export default function FormField({
  type,
  value,
  onChange,
  isError = false,
  errorMessage,
  showToggle = true,
  disabled = false,
  ...rest
}: FormFieldProps) {
  // A11y 개선을 위해 useId 훅을 사용해 고유 ID 생성
  const uniqueId = useId();
  
  // 사용자가 id를 전달했다면 그것을 사용하고, 아니면 고유 ID 생성
  const inputId = rest.id || uniqueId;
  const errorMessageId = `${inputId}-error-message`;

  const [showPassword, setShowPassword] = useState(false);
  const showToggleButton = type === 'password' && showToggle;
  
  const inputType =
    type === 'password'
      ? (showPassword ? 'text' : 'password')
      : type;
      
  const wrapperClass = [
    styles['wrapper'],
    styles[`wrapper--${type}`],
    isError ? styles['error'] : '',
  ].filter(Boolean).join(' ');

  return (
    <div className={styles['container']}>
      <BaseInput
        {...rest}

        id={inputId}

        type={inputType} 
        value={value}
        onChange={onChange}
        disabled={disabled}
        
        wrapperClassName={wrapperClass} 
        
        aria-invalid={isError}
        aria-describedby={isError ? errorMessageId : undefined}
      >
        {showToggleButton && (
          <button
            type="button"
            className={styles['wrapper__icon-right']}
            onClick={() => setShowPassword((prev) => !prev)}
            disabled={disabled}
            aria-label="toggle-password"
          >
            {showPassword ? <Eye size={20} /> : <EyeOff size={20} />}
          </button>
        )}
      </BaseInput>
      
      {isError && errorMessage && (
        <p id={errorMessageId} className={styles['error-message']}>
          {errorMessage}
        </p>
      )}
    </div>
  );
}