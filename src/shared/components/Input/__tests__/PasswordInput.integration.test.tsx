import { render, screen, fireEvent } from '@testing-library/react';
import React, { InputHTMLAttributes, ReactNode } from 'react';

import PasswordInput from '../PasswordInput/PasswordInput';

jest.mock('lucide-react', () => ({
  Eye: () => <span>EyeIcon</span>,
  EyeOff: () => <span>EyeOffIcon</span>,
}));

jest.mock('../PasswordInput.module.scss', () => ({
  wrapper: 'test-wrapper',
  'wrapper__icon-right': 'test-icon-right',
}));

interface MockBaseInputProps extends InputHTMLAttributes<HTMLInputElement> {
  children?: ReactNode;
  wrapperClassName?: string;
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
const defaultProps = {
  value: 'secure_password',
  onChange: mockOnChange,
};

describe('PasswordInput Integration Test', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('1. 기본 렌더링 시 type="password", EyeOff, "보이기" 레이블 확인', () => {
    render(<PasswordInput {...defaultProps} />);
    const input = screen.getByTestId('password-input-field');
    const toggleButton = screen.getByRole('button');

    expect(input).toHaveAttribute('type', 'password');
    expect(screen.getByText('EyeOffIcon')).toBeInTheDocument();
    expect(toggleButton).toHaveAttribute('aria-label', '비밀번호 보이기');
  });

  test('2. showToggle=false일 때 토글 버튼이 렌더링되지 않음', () => {
    render(<PasswordInput {...defaultProps} showToggle={false} />);
    expect(screen.queryByRole('button')).not.toBeInTheDocument();
  });

  test('3. 버튼 클릭 시 type 속성이 password <-> text로 전환됨', () => {
    render(<PasswordInput {...defaultProps} />);
    const input = screen.getByTestId('password-input-field');
    const toggleButton = screen.getByRole('button');

    fireEvent.click(toggleButton);
    expect(input).toHaveAttribute('type', 'text');

    fireEvent.click(toggleButton);
    expect(input).toHaveAttribute('type', 'password');
  });

  test('4. 토글 클릭 시 아이콘 및 aria-label이 올바르게 전환됨', () => {
    render(<PasswordInput {...defaultProps} />);
    const toggleButton = screen.getByRole('button');

    fireEvent.click(toggleButton);
    expect(screen.getByText('EyeIcon')).toBeInTheDocument();
    expect(toggleButton).toHaveAttribute('aria-label', '비밀번호 숨기기');
  });

  test('5. Prop과 이벤트 핸들러가 BaseInput을 통해 올바르게 작동함', () => {
    const customValue = 'new_input_value';
    const customPlaceholder = 'Enter Password';

    render(<PasswordInput {...defaultProps} placeholder={customPlaceholder} />);
    const input = screen.getByTestId('password-input-field') as HTMLInputElement;

    expect(input).toHaveValue(defaultProps.value);
    expect(input).toHaveAttribute('placeholder', customPlaceholder);

    fireEvent.change(input, { target: { value: customValue } });
    expect(mockOnChange).toHaveBeenCalledTimes(1);
  });

  test('6. disabled=true일 때 Input과 토글 버튼이 모두 비활성화되고 기능하지 않음', () => {
    render(<PasswordInput {...defaultProps} disabled={true} />);
    const input = screen.getByTestId('password-input-field');
    const toggleButton = screen.getByRole('button');

    expect(input).toBeDisabled();
    expect(toggleButton).toBeDisabled();

    fireEvent.click(toggleButton);
    expect(input).toHaveAttribute('type', 'password');
  });
});
