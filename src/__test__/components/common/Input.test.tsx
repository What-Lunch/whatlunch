import { render, screen, fireEvent } from '@testing-library/react';
import Input from '@/components/common/input/Input';

describe('Input Component 기본 기능 테스트', () => {
  test('value와 placeholder가 올바르게 표시된다.', () => {
    render(<Input value="hello" onChange={() => {}} placeholder="입력하세요" />);
    expect(screen.getByPlaceholderText('입력하세요')).toHaveValue('hello');
  });

  test('값 변경 시 onChange가 호출된다.', () => {
    const handleChange = jest.fn();
    render(<Input value="" onChange={handleChange} placeholder="test" />);
    fireEvent.change(screen.getByPlaceholderText('test'), { target: { value: 'abc' } });
    expect(handleChange).toHaveBeenCalledTimes(1);
  });

  test('focus 시 focused 클래스가 적용되고 blur 시 제거된다.', () => {
    render(<Input value="" onChange={() => {}} placeholder="focus" />);

    const input = screen.getByPlaceholderText('focus');
    const wrapper = input.parentElement as HTMLElement; // ★ 핵심 수정

    fireEvent.focus(input);
    expect(wrapper.className).toContain('focused');

    fireEvent.blur(input);
    expect(wrapper.className).not.toContain('focused');
  });

  test('error 상태에서 error 클래스와 errorMessage가 표시된다.', () => {
    render(<Input value="" onChange={() => {}} isError={true} errorMessage="에러 발생" />);

    const input = screen.getByRole('textbox');
    const wrapper = input.parentElement as HTMLElement; // ★ 핵심 수정
    const errorText = screen.getByText('에러 발생');

    expect(wrapper.className).toContain('error');
    expect(errorText).toBeInTheDocument();
  });

  test('아이콘 클릭 시 onIconClick이 호출된다.', () => {
    const handleClick = jest.fn();

    render(
      <Input
        value=""
        onChange={() => {}}
        icon={<span>*</span>}
        iconPosition="right"
        onIconClick={handleClick}
      />
    );

    fireEvent.click(screen.getByLabelText('icon-button'));
    expect(handleClick).toHaveBeenCalledTimes(1);
  });
});
