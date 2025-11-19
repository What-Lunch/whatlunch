import { render, screen, fireEvent, act, waitFor } from '@testing-library/react';
import Carousel from '@/components/Carousel';

describe('Carousel Component', () => {
  afterEach(() => {
    jest.clearAllMocks();
    jest.useRealTimers();
  });

  it('렌더링 테스트', () => {
    render(<Carousel items={[]} />);
    expect(screen.getByText('너무맛있는곰장어집')).toBeInTheDocument();
    expect(screen.queryByText('여긴어디지고기집')).not.toBeInTheDocument();
    expect(screen.queryByText('메가메가메가커피')).not.toBeInTheDocument();
  });

  it('자동 슬라이드 전환 테스트', async () => {
    jest.useFakeTimers();
    render(<Carousel items={[]} />);

    // 3초마다 슬라이드가 전환되는지 확인
    expect(screen.getByText('너무맛있는곰장어집')).toBeInTheDocument();

    act(() => {
      jest.advanceTimersByTime(3000);
    });
    act(() => {
      jest.advanceTimersByTime(300);
    });

    await waitFor(() => {
      expect(screen.getByText('여긴어디지고기집')).toBeInTheDocument();
    });

    act(() => {
      jest.advanceTimersByTime(3000);
    });
    act(() => {
      jest.advanceTimersByTime(300);
    });

    await waitFor(() => {
      expect(screen.getByText('메가메가메가커피')).toBeInTheDocument();
    });

    jest.useRealTimers();
  });

  it('페이지 네비게이션 테스트', async () => {
    jest.useFakeTimers();
    render(<Carousel items={[]} />);

    expect(screen.getByText('너무맛있는곰장어집')).toBeInTheDocument();

    const pageButtons = screen.getAllByRole('button', { name: /Go to slide/i });

    act(() => {
      jest.advanceTimersByTime(3000);
    });
    act(() => {
      jest.advanceTimersByTime(300);
    });

    await waitFor(() => {
      fireEvent.click(pageButtons[1]);
      expect(screen.getByText('여긴어디지고기집')).toBeInTheDocument();
    });

    act(() => {
      jest.advanceTimersByTime(3000);
    });
    act(() => {
      jest.advanceTimersByTime(300);
    });

    await waitFor(() => {
      fireEvent.click(pageButtons[2]);
      expect(screen.getByText('메가메가메가커피')).toBeInTheDocument();
    });

    jest.useRealTimers();
  });

  it('현재 슬라이드 이미지 렌더링 테스트', () => {
    render(<Carousel items={[]} />);

    const images = screen.getAllByRole('img', { name: /Carousel Image/i });
    expect(images.length).toBe(5);
  });

  it('같은 슬라이드 클릭시 애니메이션 동작하지 않음', () => {
    render(<Carousel items={[]} />);

    expect(screen.getByText('너무맛있는곰장어집')).toBeInTheDocument();

    const pageButtons = screen.getAllByRole('button', { name: /Go to slide/i });
    const firstButton = pageButtons[0];
    fireEvent.click(firstButton);

    expect(screen.getByText('너무맛있는곰장어집')).toBeInTheDocument();
  });

  it('도트 네비게이션이 올바르게 활성화됨', () => {
    render(<Carousel items={[]} />);

    const pageButtons = screen.getAllByRole('button', { name: /Go to slide/i });

    expect(pageButtons[0]).toHaveClass('carousel__dotActive');
    expect(pageButtons[1]).toHaveClass('carousel__dotInactive');
    expect(pageButtons[2]).toHaveClass('carousel__dotInactive');
  });

  it('접근성 테스트', () => {
    render(<Carousel items={[]} />);

    const images = screen.getAllByRole('img', { name: /Carousel Image/i });
    images.forEach(img => {
      expect(img).toHaveAttribute('alt');
    });

    const pageButtons = screen.getAllByRole('button', { name: /Go to slide/i });
    pageButtons.forEach((button, index) => {
      expect(button).toHaveAttribute('aria-label', `Go to slide ${index + 1}`);
    });
  });
});
