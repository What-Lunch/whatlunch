'use client';

import { useState } from 'react';

import { Search, X } from 'lucide-react';

import styles from './SearchInput.module.scss';
import { SearchInputProps } from './SearchInput.types';

export default function SearchInput({
  value,
  onChange,

  onSearch,
  searchIcon,
  clearIcon,

  disabled = false,

  placeholder,
  ...rest
}: SearchInputProps) {
  const [isFocused, setIsFocused] = useState(false);

  const handleFocus = () => setIsFocused(true);
  const handleBlur = () => setIsFocused(false);

  const wrapperClass = [
    styles['wrapper'],
    styles['wrapper--search'],
    isFocused ? styles['focused'] : '',
    disabled ? styles['disabled'] : '',
  ].join(' ');

  const finalSearchIcon = searchIcon ?? <Search size={18} />;
  const finalClearIcon = clearIcon ?? <X size={16} />;

  // Enter키 누르면 onSearch 실행
  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && onSearch) {
      onSearch(value);
    }
  };

  return (
    <div className={styles['container']}>
      <div className={wrapperClass}>
        <button
          type="button"
          className={styles['wrapper__icon-left']}
          disabled={disabled}
          aria-label="search-icon"
          onClick={() => onSearch && onSearch(value)}
        >
          {finalSearchIcon}
        </button>

        <input
          className={styles['input']}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          disabled={disabled}
          onFocus={handleFocus}
          onBlur={handleBlur}
          onKeyDown={handleKeyDown}
          placeholder={placeholder}
          type="text"
          {...rest}
        />

        {value.length > 0 && !disabled && (
          <button
            type="button"
            className={styles['wrapper__icon-right']}
            aria-label="clear-search"
            onClick={() => onChange('')}
          >
            {finalClearIcon}
          </button>
        )}
      </div>
    </div>
  );
}
