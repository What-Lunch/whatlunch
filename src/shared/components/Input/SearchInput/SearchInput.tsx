'use client';

import { Search, X } from 'lucide-react';

import styles from './SearchInput.module.scss';
import { SearchInputProps } from './SearchInput.types';
import BaseInput from '../BaseInput/BaseInput';

export default function SearchInput({
  value,
  onChange,
  onSearch,
  searchIcon,
  clearIcon,
  disabled = false,
  ...rest
}: SearchInputProps) {
  const finalSearchIcon = searchIcon ?? <Search size={18} />;
  const finalClearIcon = clearIcon ?? <X size={16} />;

  // Enter키 누르면 onSearch 실행
  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (disabled) return;
    if (e.key === 'Enter' && onSearch) {
      onSearch(value);
    }
    if (rest.onKeyDown) {
      rest.onKeyDown(e);
    }
  };

  const handleSearchClick = () => {
      if (disabled) return; 

      if (onSearch) {
          onSearch(value);
      }
  }

  const handleClear = () => {
      onChange({
          target: { value: '' }
      } as React.ChangeEvent<HTMLInputElement>);
  };

  const showClearButton = value.length > 0 && !disabled;
  const wrapperClass = styles['wrapper--search'];

  return (
    <div className={styles['container']}>
      <BaseInput
        type="text"
        value={value}
        onChange={onChange}
        disabled={disabled}
        
        wrapperClassName={wrapperClass} 
        
        onKeyDown={handleKeyDown} 
        {...rest}
      >
        <button
          type="button"
          className={styles['wrapper__icon-left']}
          disabled={disabled}
          aria-label="search-icon"
          onClick={handleSearchClick}
        >
          {finalSearchIcon}
        </button>
          
        {showClearButton && (
          <button
            type="button"
            className={styles['wrapper__icon-right']}
            disabled={disabled}
            aria-label="clear-search"
            onClick={handleClear}
          >
            {finalClearIcon}
          </button>
        )}
      </BaseInput>
    </div>
  );
}