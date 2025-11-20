import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import Button from '@/components/common/Button';

describe('Common Button Component', () => {
  it('기본 렌더링 — primary + md + fill', () => {
    render(<Button>Hello</Button>);

    const button = screen.getByRole('button', { name: /hello/i });

    expect(button).toBeInTheDocument();
    expect(button.classList).toContain('button');
    expect(button.classList).toContain('button--primary');
    expect(button.classList).toContain('button--md');
  });

  it('outline 모드일 경우 outline 클래스 적용', () => {
    render(
      <Button variant="secondary" mode="outline">
        Outline
      </Button>
    );

    const button = screen.getByRole('button');

    expect(button.classList).toContain('button--secondary');
    expect(button.classList).toContain('button--outline');
  });

  it('disabled 일 경우 disabled 클래스 + onClick 차단', () => {
    const handleClick = jest.fn();

    render(
      <Button disabled onClick={handleClick}>
        Disabled
      </Button>
    );

    const button = screen.getByRole('button');

    expect(button).toBeDisabled();
    expect(button.classList).toContain('button--disabled');

    fireEvent.click(button);
    expect(handleClick).not.toHaveBeenCalled();
  });

  it('onClick 실행 여부', () => {
    const handleClick = jest.fn();

    render(<Button onClick={handleClick}>Click</Button>);

    const button = screen.getByRole('button');
    fireEvent.click(button);

    expect(handleClick).toHaveBeenCalledTimes(1);
  });

  it('className props 추가 적용', () => {
    render(<Button className="custom-class">Custom</Button>);

    const button = screen.getByRole('button');

    expect(button.classList).toContain('custom-class');
  });

  it('size=null 이면 내부 size 클래스가 적용되지 않는다', () => {
    render(
      <Button size={null} className="user-size">
        Custom Size
      </Button>
    );

    const button = screen.getByRole('button');

    expect(button.classList.contains('button--sm')).toBe(false);
    expect(button.classList.contains('button--md')).toBe(false);
    expect(button.classList.contains('button--lg')).toBe(false);

    expect(button.classList).toContain('user-size');
  });

  it('size=null 일 때 inline style padding이 적용된다', () => {
    render(
      <Button size={null} style={{ padding: '30px 20px' }}>
        Inline Padding
      </Button>
    );

    const button = screen.getByRole('button');
    expect(button).toHaveStyle('padding: 30px 20px');
  });
});
