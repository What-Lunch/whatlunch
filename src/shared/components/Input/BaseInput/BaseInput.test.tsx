import { render, screen, fireEvent } from '@testing-library/react';

import BaseInput from '../BaseInput';
import styles from '../BaseInput.module.scss';

jest.mock('../BaseInput.module.scss', () => ({
  wrapper: 'test-wrapper',
  disabled: 'test-disabled',
  focused: 'test-focused',
  error: 'test-error',
  input: 'test-input',
  'input--error': 'test-input-error',
  wrapper__children: 'test-children',
}));

// Mock Props 타입은 생략, 함수는 jest.fn()으로 생성
const mockOnChange = jest.fn();
const mockOnFocus = jest.fn();
const mockOnBlur = jest.fn();
const mockOnKeyDown = jest.fn();

const defaultProps = {
  onChange: mockOnChange,
  onFocus: mockOnFocus,
  onBlur: mockOnBlur,
  onKeyDown: mockOnKeyDown,
  value: '',
};

describe('BaseInput Unit Test', () => {
  // 테스트 전후에 Mock 함수를 초기화 -> 각 테스트가 독립적 실행
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('1. value와 placeholder를 올바르게 렌더링하는 테스트', () => {
    const value = 'Test Value';
    const placeholder = 'Enter text';
    render(<BaseInput {...defaultProps} value={value} placeholder={placeholder} />);

    const input = screen.getByPlaceholderText(placeholder) as HTMLInputElement;

    expect(input).toBeInTheDocument();
    expect(input.value).toBe(value);
  });

  test('2. type과 autoComplete 속성이 올바르게 전달되는 테스트', () => {
    render(<BaseInput {...defaultProps} type="email" />);
    const input = screen.getByRole('textbox', { hidden: true });

    expect(input).toHaveAttribute('type', 'email');
    expect(input).toHaveAttribute('autocomplete', 'off');
  });

  test('3. wrapperClassName이 래퍼 div에 병합되는 테스트', () => {
    const customClass = 'custom-wrapper-class';
    render(<BaseInput {...defaultProps} wrapperClassName={customClass} />);

    const wrapper = screen.getByRole('textbox').closest('div');
    expect(wrapper).toHaveClass('test-wrapper');
    expect(wrapper).toHaveClass(customClass);
  });

  test('4. children이 올바르게 렌더링되는 테스트', () => {
    render(
      <BaseInput {...defaultProps}>
        <span data-testid="test-child">Icon Here</span>
      </BaseInput>
    );

    const childElement = screen.getByTestId('test-child');
    expect(childElement).toBeInTheDocument();

    const wrapperChildren = document.querySelector(`.${styles.wrapper__children}`);
    expect(wrapperChildren).toBeInTheDocument();
  });

  test('5. error 상태일 때 wrapper와 input에 "error" 클래스가 적용되는 테스트', () => {
    render(<BaseInput {...defaultProps} aria-invalid={true} />);
    const input = screen.getByRole('textbox');
    const wrapper = input.closest('div');

    expect(wrapper).toHaveClass('test-error');
    expect(input).toHaveClass('test-input-error');
  });

  test('6. disabled일 때 wrapper와 input에 "disabled" 클래스가 적용되는 테스트', () => {
    render(<BaseInput {...defaultProps} disabled={true} />);
    const input = screen.getByRole('textbox');
    const wrapper = input.closest('div');

    expect(input).toBeDisabled();
    expect(wrapper).toHaveClass('test-disabled');
  });

  test('7. focus 시 wrapper에 "focused" 클래스가 적용되고 blur 시 제거되는 테스트', () => {
    render(<BaseInput {...defaultProps} />);
    const input = screen.getByRole('textbox');
    const wrapper = input.closest('div');

    fireEvent.focus(input);
    expect(wrapper).toHaveClass('test-focused');

    fireEvent.blur(input);
    expect(wrapper).not.toHaveClass('test-focused');
  });

  test('8. disableFocusStyle=true 일 때 포커스 클래스가 비활성화되는 테스트', () => {
    render(<BaseInput {...defaultProps} disableFocusStyle={true} />);
    const input = screen.getByRole('textbox');
    const wrapper = input.closest('div');

    fireEvent.focus(input);
    expect(wrapper).not.toHaveClass('test-focused');
  });

  test('9. aria-describedby가 올바르게 전달되는 테스트', () => {
    const describedById = 'error-message-id';
    render(<BaseInput {...defaultProps} aria-describedby={describedById} />);
    const input = screen.getByRole('textbox');

    expect(input).toHaveAttribute('aria-describedby', describedById);
  });

  test('10. onChange 핸들러가 사용자 입력 시 호출되는 테스트', () => {
    render(<BaseInput {...defaultProps} />);
    const input = screen.getByRole('textbox') as HTMLInputElement;
    const newValue = 'testing';

    fireEvent.change(input, { target: { value: newValue } });

    expect(mockOnChange).toHaveBeenCalledTimes(1);

    const receivedEvent = mockOnChange.mock.calls[0][0];

    expect(mockOnChange).toHaveBeenCalled();
    expect(receivedEvent).toHaveProperty('target');
  });

  test('11. onFocus/onBlur 핸들러가 올바르게 호출되는 테스트', () => {
    render(<BaseInput {...defaultProps} />);
    const input = screen.getByRole('textbox');

    fireEvent.focus(input);
    expect(mockOnFocus).toHaveBeenCalledTimes(1);

    fireEvent.blur(input);
    expect(mockOnBlur).toHaveBeenCalledTimes(1);
  });

  test('12. onKeyDown 핸들러가 키 입력 시 호출되는 테스트', () => {
    render(<BaseInput {...defaultProps} />);
    const input = screen.getByRole('textbox');

    fireEvent.keyDown(input, { key: 'Enter' });

    expect(mockOnKeyDown).toHaveBeenCalledTimes(1);
  });
});
