'use client';

import { useId, cloneElement, isValidElement } from 'react';
import { ErrorWrapperProps } from './ErrorWrapper.types';
import styles from './ErrorWrapper.module.scss';

export default function ErrorWrapper({
  isError = false,
  errorMessage,
  children,
}: ErrorWrapperProps) {
  const uniqueId = useId();
  const errorMessageId = `error-message-${uniqueId}`;

  const errorProps = isError
    ? {
        'aria-describedby': errorMessageId,
        'aria-invalid': true,
      }
    : {};

  const inputWithA11y = isValidElement(children) ? cloneElement(children, errorProps) : children;

  const wrapperClass = [styles['wrapper'], isError && styles['wrapper--error']]
    .filter(Boolean)
    .join(' ');

  return (
    <div className={wrapperClass}>
      {inputWithA11y}
      {isError && errorMessage && (
        <p id={errorMessageId} className={styles['wrapper__message']} role="alert">
          {errorMessage}
        </p>
      )}
    </div>
  );
}
