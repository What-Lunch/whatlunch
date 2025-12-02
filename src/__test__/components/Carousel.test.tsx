import { render, screen, fireEvent } from '@testing-library/react';
import Carousel from '@/components/Carousel';

describe('Carousel Component', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it('렌더링 테스트', () => {
    render(<Carousel />);
    expect(screen.getByText('너무맛있는곰장어집')).toBeInTheDocument();
    expect(screen.queryByText('여긴어디지고기집')).not.toBeInTheDocument();
    expect(screen.queryByText('메가메가메가커피')).not.toBeInTheDocument();
  });

  it('자동 슬라이드 전환 테스트', () => {
    jest.useFakeTimers();
    render(<Carousel />);

    // 3초마다 슬라이드가 전환되는지 확인
    expect(screen.getByText('너무맛있는곰장어집')).toBeInTheDocument();

    jest.advanceTimersByTime(3000);
    expect(screen.getByText('여긴어디지고기집')).toBeInTheDocument();

    jest.advanceTimersByTime(3000);
    expect(screen.getByText('메가메가메가커피')).toBeInTheDocument();

    jest.useRealTimers();
  });

  it('페이지 네비게이션 테스트', () => {
    render(<Carousel />);

    expect(screen.getByText('너무맛있는곰장어집')).toBeInTheDocument();

    const pageButtons = screen.getAllByRole('button', { name: /Go to slide/i });
    fireEvent.click(pageButtons[1]);
    expect(screen.getByText('여긴어디지고기집')).toBeInTheDocument();

    fireEvent.click(pageButtons[2]);
    expect(screen.getByText('메가메가메가커피')).toBeInTheDocument();
  });

  it('현재 슬라이드 이미지 렌더링 테스트', () => {
    render(<Carousel />);

    const images = screen.getAllByRole('img', { name: /Carousel Image/i });
    expect(images.length).toBe(5);
  });
});
