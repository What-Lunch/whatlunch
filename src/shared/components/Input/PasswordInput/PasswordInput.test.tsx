import React, { useState } from 'react';
import { render, screen, fireEvent } from '@testing-library/react';

import PasswordInput from './PasswordInput';
import { PasswordInputProps } from './PasswordInput.types';

interface ControlledFormFieldWrapperProps
  extends Omit<PasswordInputProps, 'value' | 'onChange'> {
  initialValue?: string;
  mockOnChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

const ControlledFormFieldWrapper: React.FC<ControlledFormFieldWrapperProps> = ({
  initialValue = '',
  mockOnChange,
  ...rest
}) => {
  const [currentValue, setCurrentValue] = useState(initialValue);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setCurrentValue(e.target.value);
    if (mockOnChange) mockOnChange(e);
  };

  return (
    <PasswordInput
      {...rest}
      value={currentValue}
      onChange={handleChange}
    />
  );
};

describe('FormField Component', () => {
  const mockOnChange = jest.fn();

  test('기본 렌더링 테스트 - email 타입이 정상적으로 보이는지 테스트', () => {
    render(
      <PasswordInput
        type="email"
        value=""
        onChange={mockOnChange}
        placeholder="email address"
      />
    );

    expect(screen.getByPlaceholderText('email address')).toBeInTheDocument();
  });

  test('사용자가 입력 시 Input의 value가 새 값으로 올바르게 업데이트되는지 테스트', () => {
    const testValue = 'new test value';

    render(
      <ControlledFormFieldWrapper
        type="text"
        placeholder="controlled-formfield"
      />
    );

    const input = screen.getByPlaceholderText('controlled-formfield');
    fireEvent.change(input, { target: { value: testValue } });

    expect(input).toHaveValue(testValue);
  });

  test('onChange prop으로 전달된 mock 함수가 ChangeEvent를 받아 정확히 호출되는지 테스트', () => {
    const propMockOnChange = jest.fn();
    const testValue = 'event check';

    render(
      <ControlledFormFieldWrapper
        type="text"
        mockOnChange={propMockOnChange}
        placeholder="event-check-input"
      />
    );

    const input = screen.getByPlaceholderText('event-check-input');
    fireEvent.change(input, { target: { value: testValue } });

    expect(propMockOnChange).toHaveBeenCalledTimes(1);

    const event =
      propMockOnChange.mock.calls[0][0] as React.ChangeEvent<HTMLInputElement>;
    expect(event.target.value).toBe(testValue);
  });

  test('type="text"일 때 isError=true 시 에러 메시지가 정확히 출력되는지 테스트', () => {
    const errorMessageText = '닉네임은 최소 2자 이상 필요합니다.';

    render(
      <PasswordInput
        type="text"
        value="a"
        onChange={mockOnChange}
        isError={true}
        errorMessage={errorMessageText}
      />
    );

    expect(screen.getByText(errorMessageText)).toBeInTheDocument();
  });

  test('disabled일 때 input 비활성화되는지 테스트', () => {
    render(<PasswordInput type="email" value="" onChange={mockOnChange} disabled />);

    const input = screen.getByRole('textbox');
    expect(input).toBeDisabled();
  });

  test('eye icon 토글 클릭 시, type 변환이 잘 되는지 테스트', () => {
    render(
      <PasswordInput
        type="password"
        value="1234"
        onChange={mockOnChange}
        showToggle={true}
      />
    );

    const input = screen.getByDisplayValue('1234');
    const toggleButton = screen.getByLabelText('toggle-password');

    expect(input).toHaveAttribute('type', 'password');

    fireEvent.click(toggleButton);
    expect(input).toHaveAttribute('type', 'text');

    fireEvent.click(toggleButton);
    expect(input).toHaveAttribute('type', 'password');
  });

  test('showToggle={false}일 때 토글 버튼이 렌더링되지 않는지 테스트', () => {
    render(
      <PasswordInput
        type="password"
        value="1234"
        onChange={mockOnChange}
        showToggle={false}
      />
    );

    expect(
      screen.queryByLabelText('toggle-visibility')
    ).not.toBeInTheDocument();
  });
});
