import { render, screen, fireEvent } from '@testing-library/react';
import FormInput from './FormInput';

describe('FormInput', () => {
  test('기본 렌더링 테스트 - email 타입이 정상적으로 보이는지 테스트', () => {
    render(<FormInput type="email" value="" onChange={() => {}} placeholder="email" />);
    expect(screen.getByPlaceholderText('email')).toBeInTheDocument();
  });

  test('사용자가 입력 시 onChange(value)가 잘 호출되는지 테스트', () => {
    const handleChange = jest.fn();
    render(<FormInput type="email" value="" onChange={handleChange} />);

    fireEvent.change(screen.getByRole('textbox'), { target: { value: 'test' } });

    expect(handleChange).toHaveBeenCalledWith('test');
  });

  test('에러 메시지 출력 테스트', () => {
    render(
      <FormInput
        type="email"
        value=""
        onChange={() => {}}
        isError={true}
        errorMessage="Invalid"
      />
    );
    expect(screen.getByText('Invalid')).toBeInTheDocument();
  });

  test('disabled일 때 input 비활성화되는지 테스트', () => {
    render(<FormInput type="email" value="" onChange={() => {}} disabled />);

    const input = screen.getByRole('textbox');
    expect(input).toBeDisabled();
  });

  test('eye icon 토글 클릭 시, type 변환이 잘 되는지 테스트', () => {
    render(<FormInput type="password" value="1234" onChange={() => {}} showToggle />);

    const input = screen.getByDisplayValue('1234');
    const toggleButton = screen.getByLabelText('toggle-password');

    // 초기 상태 = password
    expect(input).toHaveAttribute('type', 'password');

    // 클릭 후 = text
    fireEvent.click(toggleButton);
    expect(input).toHaveAttribute('type', 'text');

    // 다시 클릭 = password
    fireEvent.click(toggleButton);
    expect(input).toHaveAttribute('type', 'password');
  });
});
