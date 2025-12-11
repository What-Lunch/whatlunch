'use client';

import { useState } from 'react';
import { Eye, EyeOff } from 'lucide-react';

import styles from './FormField.module.scss';
import { FormFieldProps } from './FormField.types';
import BaseInput from '../BaseInput/BaseInput';

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
  
  const errorMessageId = `${rest.id || 'app-form-field'}-error-message`;

  return (
    <div className={styles['container']}>
      <BaseInput
        type={inputType} 
        value={value}
        onChange={onChange}
        disabled={disabled}
        
        wrapperClassName={wrapperClass} 
        
        aria-invalid={isError}
        aria-describedby={isError ? errorMessageId : undefined}
        {...rest}
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