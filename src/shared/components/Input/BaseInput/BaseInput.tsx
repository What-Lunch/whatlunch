'use client';

import { forwardRef, ChangeEvent, useState, FocusEvent, useCallback } from 'react';
import { BaseInputProps } from './types';
import styles from './BaseInput.module.scss';

const BaseInput = forwardRef<HTMLInputElement, BaseInputProps>(
  (
    {
      type = 'text',
      className,
      value,
      placeholder,
      disabled,
      children,
      wrapperClassName,
      'aria-invalid': ariaInvalid,
      'aria-describedby': ariaDescribedby,
      onChange,
      onKeyDown,
      onFocus,
      onBlur,
      disableFocusStyle = false,
      ...rest
    },
    ref
  ) => {
    const [isFocused, setIsFocused] = useState(false);
    const isError = ariaInvalid === true;

    const handleFocus = useCallback(
      (e: FocusEvent<HTMLInputElement>) => {
        setIsFocused(true);
        onFocus?.(e);
      },
      [onFocus]
    );

    const handleBlur = useCallback(
      (e: FocusEvent<HTMLInputElement>) => {
        setIsFocused(false);
        onBlur?.(e);
      },
      [onBlur]
    );

    const inputWrapperClass = [
      styles['wrapper'],
      disabled && styles['disabled'],
      isFocused && !disableFocusStyle && styles['focused'],
      isError && styles['error'],
      wrapperClassName,
    ]
      .filter(Boolean)
      .join(' ');

    const inputClass = [styles['input'], isError && styles['input--error'], className]
      .filter(Boolean)
      .join(' ');

    const handleChange = useCallback(
      (e: ChangeEvent<HTMLInputElement>) => {
        onChange?.(e);
      },
      [onChange]
    );

    return (
      <div className={inputWrapperClass}>
        <input
          ref={ref}
          type={type}
          className={inputClass}
          value={value}
          placeholder={placeholder}
          disabled={disabled}
          aria-invalid={ariaInvalid}
          aria-describedby={ariaDescribedby}
          onChange={handleChange}
          onKeyDown={onKeyDown}
          onFocus={handleFocus}
          onBlur={handleBlur}
          autoComplete="off"
          {...rest}
        />
        {children && <div className={styles['wrapper__children']}>{children}</div>}
      </div>
    );
  }
);

BaseInput.displayName = 'BaseInput';
export default BaseInput;
