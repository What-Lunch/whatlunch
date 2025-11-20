'use client';

import React, { useState, forwardRef } from 'react';
import styles from './Input.module.scss';

import { InputProps } from './Input.types';

const Input = forwardRef<HTMLInputElement, InputProps>((props, ref) => {
  const {
    value,
    onChange,
    isError = false,
    errorMessage,
    leftIcon,
    rightIcon,
    onRightIconClick,
    className,
    onFocus,
    onBlur,
    disabled,
    ...restProps
  } = props;

  // 1. Focus 상태 관리 로직
  const [isFocused, setIsFocused] = useState(false);

  const handleFocus = (e: React.FocusEvent<HTMLInputElement>) => {
    setIsFocused(true);
    onFocus?.(e);
  };

  const handleBlur = (e: React.FocusEvent<HTMLInputElement>) => {
    setIsFocused(false);
    onBlur?.(e);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (disabled) {
      return;
    }
    onChange?.(e);
  };

  // 2. 상태별 CSS 클래스 조합
  const wrapperClasses = [
    styles.wrapper,
    className,
    isFocused && styles.focused,
    isError && styles.error,
    disabled && styles.disabled,
  ]
    .filter(Boolean)
    .join(' ');

  return (
    // 전체 컴포넌트 컨테이너
    <div className={styles.container}>
      {/* 입력 필드와 아이콘을 감싸는 Wrapper */}
      <div className={wrapperClasses}>
        {/* 3. 왼쪽 아이콘 조건부 렌더링 */}
        {leftIcon && <div className={styles.leftIcon}>{leftIcon}</div>}

        {/* 4. 실제 HTML Input 요소 (제어 컴포넌트의 핵심) */}
        <input
          ref={ref}
          value={value}
          onChange={handleChange}
          onFocus={handleFocus}
          onBlur={handleBlur}
          className={styles.input}
          disabled={disabled}
          {...restProps}
        />

        {/* 5. 오른쪽 아이콘 조건부 렌더링 및 이벤트 연결 */}
        {rightIcon && (
          <div
            className={`${styles.rightIcon} ${onRightIconClick ? styles.clickable : ''}`}
            onClick={onRightIconClick}
          >
            {rightIcon}
          </div>
        )}
      </div>

      {/* 6. 오류 메시지 조건부 렌더링 */}
      {isError && errorMessage && <p className={styles.errorMessage}>{errorMessage}</p>}
    </div>
  );
});

Input.displayName = 'Input';
export default Input;
