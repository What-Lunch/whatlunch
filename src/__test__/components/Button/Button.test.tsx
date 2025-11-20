import { render, screen, fireEvent } from '@testing-library/react';
import Button from '@/components/Button/Button';
import '@testing-library/jest-dom';

describe('Button Component (팀원 스타일 BEM)', () => {
  it('기본 렌더링 — primary + fill', () => {
    render(<Button>Hello</Button>);

    const button = screen.getByRole('button', { name: /hello/i });

    expect(button).toBeInTheDocument();
    expect(button.classList).toContain('button');
    expect(button.classList).toContain('button__primary');
    expect(button.classList).toContain('button__md'); // 기본 size
  });

  it('outline 모드일 경우 올바른 클래스 적용', () => {
    render(
      <Button mode="outline" variant="secondary">
        Outline Button
      </Button>
    );

    const button = screen.getByRole('button');

    expect(button.classList).toContain('button__secondary__outline');
  });

  it('danger + outline 조합 테스트', () => {
    render(
      <Button variant="danger" mode="outline">
        Danger Outline
      </Button>
    );

    const button = screen.getByRole('button');

    expect(button.classList).toContain('button__danger__outline');
  });

  it('variant = danger + fill 모드 클래스 적용', () => {
    render(<Button variant="danger">Danger Button</Button>);

    const button = screen.getByRole('button');

    expect(button.classList).toContain('button__danger');
    expect(button.classList).not.toContain('button__danger__outline');
  });

  it('disabled 일 경우 클래스 + 속성 적용 및 onClick 차단', () => {
    const handleClick = jest.fn();

    render(
      <Button disabled onClick={handleClick}>
        Disabled
      </Button>
    );

    const button = screen.getByRole('button');

    expect(button).toBeDisabled();
    expect(button.classList).toContain('button__disabled');

    fireEvent.click(button);
    expect(handleClick).not.toHaveBeenCalled();
  });

  it('className props 추가 적용', () => {
    render(<Button className="custom-class">Custom</Button>);

    const button = screen.getByRole('button');

    expect(button.classList).toContain('custom-class');
  });

  it('onClick 실행 여부', () => {
    const handleClick = jest.fn();

    render(<Button onClick={handleClick}>Click Me</Button>);

    const button = screen.getByRole('button');
    fireEvent.click(button);

    expect(handleClick).toHaveBeenCalledTimes(1);
  });

  it('reset 버튼 테스트', () => {
    const handleReset = jest.fn();

    render(
      <form onReset={handleReset}>
        <Button type="reset">초기화</Button>
      </form>
    );

    const resetBtn = screen.getByRole('button', { name: /초기화/i });
    fireEvent.click(resetBtn);

    expect(handleReset).toHaveBeenCalledTimes(1);
  });

  it('submit 버튼 테스트', () => {
    const handleSubmit = jest.fn(e => e.preventDefault());

    render(
      <form onSubmit={handleSubmit}>
        <Button type="submit">제출</Button>
      </form>
    );

    const submitBtn = screen.getByRole('button', { name: /제출/i });
    fireEvent.click(submitBtn);

    expect(handleSubmit).toHaveBeenCalledTimes(1);
    expect(handleSubmit.mock.calls[0][0].preventDefault).toBeDefined();
  });
});
