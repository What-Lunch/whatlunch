'use client';

import { useState } from 'react';
import { Eye, EyeOff } from 'lucide-react';

import BaseInput from '../BaseInput/BaseInput';
import { PasswordInputProps } from './PasswordInput.types';
import styles from './PasswordInput.module.scss';

export default function PasswordInput({
  value,
  onChange,
  showToggle = true,
  disabled = false,
  ...rest
}: PasswordInputProps) {
  const [showPassword, setShowPassword] = useState(false);
  const inputType = showPassword ? 'text' : 'password';

  const wrapperClass = [styles['wrapper']].filter(Boolean).join(' ');

  return (
    <BaseInput
      {...rest}
      type={inputType}
      value={value}
      onChange={onChange}
      disabled={disabled}
      wrapperClassName={wrapperClass}
    >
      {showToggle && (
        <button
          type="button"
          className={styles['wrapper__icon-right']}
          onClick={() => setShowPassword(prev => !prev)}
          disabled={disabled}
          aria-label={showPassword ? '비밀번호 숨기기' : '비밀번호 보이기'}
        >
          {showPassword ? <Eye size={20} /> : <EyeOff size={20} />}
        </button>
      )}
    </BaseInput>
  );
}
