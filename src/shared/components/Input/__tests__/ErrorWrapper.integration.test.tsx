import { render, screen } from '@testing-library/react';
import React, { FC } from 'react';

import ErrorWrapper from '../ErrorWrapper';

interface MockInputProps {
  'aria-describedby'?: string;
  'aria-invalid'?: boolean;
  className?: string;
  children?: React.ReactNode;
}

const MockBaseInput: FC<MockInputProps> = props => {
  return <input type="text" data-testid="mock-input" role="textbox" {...props} />;
};

jest.mock('../ErrorWrapper.module.scss', () => ({
  wrapper: 'test-wrapper',
  'wrapper--error': 'test-wrapper-error',
  wrapper__message: 'test-message',
}));

describe('ErrorWrapper Integration Test', () => {
  test('1. 자식 컴포넌트 렌더링 및 에러 메시지 없음', () => {
    const inputElement = <MockBaseInput />;
    render(<ErrorWrapper errorMessage="Test Error">{inputElement}</ErrorWrapper>);

    const input = screen.getByTestId('mock-input');
    const errorMessage = screen.queryByRole('alert');

    const wrapper = input.closest('div');
    expect(wrapper).toHaveClass('test-wrapper');
    expect(wrapper).not.toHaveClass('test-wrapper-error');

    expect(input).toBeInTheDocument();
    expect(errorMessage).not.toBeInTheDocument();

    expect(input).not.toHaveAttribute('aria-invalid');
    expect(input).not.toHaveAttribute('aria-describedby');
  });

  test('2. isError=true일 때 에러 메시지와 스타일이 올바르게 적용되는지', () => {
    const errorMsg = '필수 항목입니다.';
    const inputElement = <MockBaseInput />;

    render(
      <ErrorWrapper isError={true} errorMessage={errorMsg}>
        {inputElement}
      </ErrorWrapper>
    );

    const input = screen.getByTestId('mock-input');
    const errorMessageElement = screen.getByText(errorMsg);
    const wrapper = input.closest('div');

    expect(wrapper).toHaveClass('test-wrapper-error');

    expect(errorMessageElement).toBeInTheDocument();
    expect(errorMessageElement).toHaveClass('test-message');
    expect(errorMessageElement).toHaveAttribute('role', 'alert');
  });

  test('3. Input과 에러 메시지의 접근성(A11y) 통합 검증 (ARIA 연결)', () => {
    const errorMsg = '잘못된 형식입니다.';
    const inputElement = <MockBaseInput />;

    render(
      <ErrorWrapper isError={true} errorMessage={errorMsg}>
        {inputElement}
      </ErrorWrapper>
    );

    const input = screen.getByTestId('mock-input');
    const errorMessageElement = screen.getByText(errorMsg);

    expect(input).toHaveAttribute('aria-invalid', 'true');
    const errorMessageId = errorMessageElement.getAttribute('id');
    expect(errorMessageId).toBeTruthy();
    expect(input).toHaveAttribute('aria-describedby', errorMessageId);
  });

  test('4. errorMessage가 빈 문자열일 때 메시지가 렌더링되지 않음', () => {
    const inputElement = <MockBaseInput />;
    render(
      <ErrorWrapper isError={true} errorMessage="">
        {inputElement}
      </ErrorWrapper>
    );

    expect(screen.queryByRole('alert')).not.toBeInTheDocument();

    const input = screen.getByTestId('mock-input');
    expect(input).toHaveAttribute('aria-invalid', 'true');
  });

  test('5. children이 유효한 React Element가 아닐 경우에도 오류없이 렌더링되는지', () => {
    const textChild = 'Hello, World';

    render(
      <ErrorWrapper isError={false} errorMessage={undefined}>
        {textChild}
      </ErrorWrapper>
    );

    expect(screen.getByText(textChild)).toBeInTheDocument();
  });
});
