import { render, screen, fireEvent } from '@testing-library/react';
import React, { InputHTMLAttributes, ReactNode } from 'react';

import SearchInput from '../SearchInput/SearchInput';

jest.mock('lucide-react', () => ({
  Search: () => <span>SearchIcon</span>,
  X: () => <span>XIcon</span>,
}));

jest.mock('../PasswordInput.module.scss', () => ({
  wrapper: 'test-wrapper',
  'wrapper__icon-right': 'test-icon-right',
}));

interface MockBaseInputProps extends InputHTMLAttributes<HTMLInputElement> {
  children?: ReactNode;
  wrapperClassName?: string;
  disableFocusStyle?: boolean;
}

jest.mock('../BaseInput/BaseInput', () => {
  const MockBaseInput = React.forwardRef<HTMLInputElement, MockBaseInputProps>((props, ref) => {
    const { type, children, wrapperClassName, ...restInputProps } = props;

    return (
      <div data-testid="base-input-wrapper" className={wrapperClassName}>
        <input ref={ref} type={type} data-testid="password-input-field" {...restInputProps} />
        {children}
      </div>
    );
  });

  MockBaseInput.displayName = 'MockBaseInput';
  return MockBaseInput;
});

const mockOnChange = jest.fn();
const mockOnSearch = jest.fn();
const mockOnClear = jest.fn();
const mockOnKeyDown = jest.fn();

const defaultProps = {
  value: '',
  onChange: mockOnChange,
  onSearch: mockOnSearch,
};

const filledProps = {
  value: 'test query',
  onChange: mockOnChange,
  onSearch: mockOnSearch,
};

describe('SearchInput Integration Test', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('1. 기본 렌더링 시 type="text"와 검색 아이콘 확인', () => {
    render(<SearchInput {...defaultProps} />);
    const input = screen.getByTestId('password-input-field');
    const searchButton = screen.getByRole('button', { name: 'search-icon' });

    expect(input).toHaveAttribute('type', 'text');
    expect(searchButton).toBeInTheDocument();
    expect(screen.getByText('SearchIcon')).toBeInTheDocument();
  });

  test('2. value가 비어있을 때 클리어 버튼이 숨겨짐', () => {
    render(<SearchInput {...defaultProps} />);
    expect(screen.queryByRole('button', { name: 'search-clear' })).not.toBeInTheDocument();
  });

  test('3. value가 있을 때 클리어 버튼이 표시됨', () => {
    render(<SearchInput {...filledProps} />);
    const clearButton = screen.getByRole('button', { name: 'search-clear' });
    expect(clearButton).toBeInTheDocument();
    expect(screen.getByText('XIcon')).toBeInTheDocument();
  });

  test('4. 커스텀 아이콘이 올바르게 적용됨', () => {
    const CustomSearchIcon = () => <span>CustomSearch</span>;
    const CustomClearIcon = () => <span>CustomClear</span>;

    render(
      <SearchInput
        {...filledProps}
        searchIcon={<CustomSearchIcon />}
        clearIcon={<CustomClearIcon />}
      />
    );

    expect(screen.getByText('CustomSearch')).toBeInTheDocument();
    expect(screen.getByText('CustomClear')).toBeInTheDocument();
    expect(screen.queryByText('SearchIcon')).not.toBeInTheDocument();
  });

  test('5. Enter 키 입력 시 onSearch가 value와 함께 호출됨', () => {
    render(<SearchInput {...filledProps} />);
    const input = screen.getByTestId('password-input-field');

    fireEvent.keyDown(input, { key: 'Enter', code: 'Enter' });

    expect(mockOnSearch).toHaveBeenCalledTimes(1);
    expect(mockOnSearch).toHaveBeenCalledWith('test query');
  });

  test('6. 검색 아이콘 클릭 시 onSearch가 value와 함께 호출됨', () => {
    render(<SearchInput {...filledProps} />);
    const searchButton = screen.getByRole('button', { name: 'search-icon' });

    fireEvent.click(searchButton);

    expect(mockOnSearch).toHaveBeenCalledTimes(1);
    expect(mockOnSearch).toHaveBeenCalledWith('test query');
  });

  test('7. 다른 onKeyDown 콜백이 통합되어 호출됨', () => {
    render(<SearchInput {...filledProps} onKeyDown={mockOnKeyDown} />);
    const input = screen.getByTestId('password-input-field');

    fireEvent.keyDown(input, { key: 'A' });

    expect(mockOnKeyDown).toHaveBeenCalledTimes(1);
    expect(mockOnSearch).not.toHaveBeenCalled();
  });

  test('8. 클리어 버튼 클릭 시 (onClear 없음) onChange를 통해 value를 ""로 초기화', () => {
    render(<SearchInput {...filledProps} onClear={undefined} />);
    const clearButton = screen.getByRole('button', { name: 'search-clear' });

    fireEvent.click(clearButton);

    expect(mockOnChange).toHaveBeenCalledTimes(1);
    expect(mockOnChange).toHaveBeenCalledWith(
      expect.objectContaining({
        target: expect.objectContaining({
          value: '',
        }),
      })
    );
  });

  test('9. onClear prop이 있을 때, 클리어 버튼 클릭 시 onClear만 호출', () => {
    render(<SearchInput {...filledProps} onClear={mockOnClear} />);
    const clearButton = screen.getByRole('button', { name: 'search-clear' });

    fireEvent.click(clearButton);

    expect(mockOnClear).toHaveBeenCalledTimes(1);
    expect(mockOnChange).not.toHaveBeenCalled();
  });

  test('10. Disabled 상태 시 모든 기능이 비활성화됨', () => {
    render(<SearchInput {...filledProps} disabled={true} />);
    const input = screen.getByTestId('password-input-field');
    const searchButton = screen.getByRole('button', { name: 'search-icon' });
    const clearButton = screen.queryByRole('button', { name: 'search-clear' });

    expect(input).toBeDisabled();
    expect(searchButton).toBeDisabled();

    expect(clearButton).not.toBeInTheDocument();

    fireEvent.click(searchButton);
    fireEvent.keyDown(input, { key: 'Enter' });

    expect(mockOnSearch).not.toHaveBeenCalled();
    expect(mockOnChange).not.toHaveBeenCalled();
  });
});
