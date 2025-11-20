import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import Input from '../../../components/common/input/Input';
import styles from '../../../styles/Input.module.scss';

const MockIcon = () => <span>[ICON]</span>;

describe('Input Component 표준 기능 테스트', () => {
  const defaultProps = {
    value: '',
    onChange: jest.fn(), // Jest의 Mock 함수를 사용
    placeholder: '테스트용 Placeholder',
    'data-testid': 'input-wrapper',
  };

  test('1. 기본 렌더링: value와 placeholder를 올바르게 표시해야 한다.', () => {
    render(<Input {...defaultProps} value="Hello World" />);
    const inputElement = screen.getByPlaceholderText('테스트용 Placeholder') as HTMLInputElement;

    expect(inputElement.value).toBe('Hello World');
  });

  test('2. 데이터 흐름: 값이 변경될 때 onChange 함수가 호출되어야 한다.', () => {
    render(<Input {...defaultProps} />);
    const inputElement = screen.getByPlaceholderText('테스트용 Placeholder');

    fireEvent.change(inputElement, { target: { value: 'test input' } });

    expect(defaultProps.onChange).toHaveBeenCalledTimes(1);
  });

  test('3. Focus 상태: Focus 시 .focused 클래스가 적용되고 Blur 시 제거되어야 한다.', () => {
    const { container } = render(<Input {...defaultProps} />);
    const inputElement = screen.getByPlaceholderText('테스트용 Placeholder');
    const wrapper = container.querySelector(`.${styles.wrapper.split(' ')[0]}`);

    expect(wrapper).toBeInTheDocument();

    fireEvent.focus(inputElement);
    expect(wrapper).toHaveClass(styles.focused);

    fireEvent.blur(inputElement);
    expect(wrapper).not.toHaveClass(styles.focused);
  });

  test('4. Error 상태: isError일 때 오류 메시지와 .error 클래스를 표시해야 한다.', () => {
    const errorMessage = '필수 입력 항목입니다.';
    const { container } = render(
      <Input {...defaultProps} isError={true} errorMessage={errorMessage} />
    );

    const wrapper = container.querySelector(`.${styles.wrapper.split(' ')[0]}`);

    expect(wrapper).toBeInTheDocument();

    expect(screen.getByText(errorMessage)).toBeInTheDocument();

    expect(wrapper).toHaveClass(styles.error);
  });

  test('5. 아이콘 기능: 오른쪽 아이콘 클릭 시 이벤트가 호출되어야 한다.', () => {
    const handleClick = jest.fn();
    render(
      <Input
        {...defaultProps}
        leftIcon={<MockIcon />}
        rightIcon={<MockIcon />}
        onRightIconClick={handleClick}
      />
    );
    const rightIconElement = screen.getAllByText('[ICON]')[1];

    expect(screen.getAllByText('[ICON]')).toHaveLength(2);

    fireEvent.click(rightIconElement);

    expect(handleClick).toHaveBeenCalledTimes(1);
  });

  test('6. Disabled 상태: disabled prop 적용 시 입력 및 클릭이 차단되고 .disabled 클래스가 적용되어야 한다.', () => {
    const onChangeMock = jest.fn();
    const { container } = render(
      <Input {...defaultProps} disabled={true} onChange={onChangeMock} />
    );
    const inputElement = screen.getByPlaceholderText('테스트용 Placeholder') as HTMLInputElement;

    const wrapper = container.querySelector(`.${styles.wrapper.split(' ')[0]}`);

    expect(inputElement).toBeDisabled();

    fireEvent.change(inputElement, { target: { value: 'test' } });

    expect(onChangeMock).not.toHaveBeenCalled();

    expect(wrapper).toHaveClass(styles.disabled);
  });

  test('7. 기본 HTML 속성 지원: type과 외부 className이 올바르게 적용되어야 한다.', () => {
    const customClassName = 'my-custom-form-field';
    const { container } = render(
      <Input {...defaultProps} type="password" className={customClassName} />
    );
    const inputElement = screen.getByPlaceholderText('테스트용 Placeholder') as HTMLInputElement;

    const wrapper = container.querySelector(`.${styles.wrapper.split(' ')[0]}`);

    expect(inputElement.type).toBe('password');

    expect(wrapper).toHaveClass(customClassName);
  });
});
