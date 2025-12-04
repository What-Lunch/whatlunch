import { render, screen, fireEvent, act, waitFor } from '@testing-library/react';
import Carousel from '@/shared/components/Carousel';
import { StaticImageData } from 'next/image';

const mockImage: StaticImageData = {
  src: '/test-image.jpg',
  height: 100,
  width: 100,
  blurDataURL: '',
};

const mockItems = [
  {
    src: [mockImage, mockImage, mockImage, mockImage, mockImage],
    title: '너무맛있는곰장어집',
    category: '식당',
    rating: 4.5,
    location: '서울 마포',
  },
  {
    src: [mockImage, mockImage, mockImage, mockImage, mockImage],
    title: '여긴어디지고기집',
    category: '식당',
    rating: 4.0,
    location: '서울 강남',
  },
  {
    src: [mockImage, mockImage, mockImage, mockImage, mockImage],
    title: '메가메가메가커피',
    category: '카페',
    rating: 3.5,
    location: '충남 대전',
  },
];

describe('Carousel Component', () => {
  afterEach(() => {
    jest.clearAllMocks();
    jest.useRealTimers();
  });

  it('렌더링 테스트', () => {
    render(<Carousel items={mockItems} />);
    expect(screen.getByTestId('carousel-item-0')).toBeInTheDocument();
    expect(screen.queryByTestId('carousel-item-1')).toBeInTheDocument();
    expect(screen.queryByTestId('carousel-item-2')).toBeInTheDocument();
    const activeItem = screen.getByRole('listitem', { current: true });
    expect(activeItem).toBeInTheDocument();
  });

  it('슬라이드 이동 시 이미지가 올바르게 변경된다', async () => {
    render(<Carousel items={mockItems} />);
    const pageButtons = screen.getAllByRole('button', { name: /Go to slide/i });

    act(() => {
      fireEvent.click(pageButtons[1]);
    });

    await waitFor(() => {
      const activeSlide = screen.getByTestId('carousel-item-1');
      const images = activeSlide.querySelectorAll('img');
      expect(images[0]).toHaveAttribute('alt', '여긴어디지고기집 - Image 1');
    });
  });

  it('현재 슬라이드 이미지 렌더링 테스트', () => {
    render(<Carousel items={mockItems} />);
    const activeSlide = screen.getByTestId('carousel-item-0');
    const images = activeSlide.querySelectorAll('img');
    expect(images.length).toBe(3);
  });

  it('페이지 네비게이션 테스트', async () => {
    render(<Carousel items={mockItems} />);

    expect(screen.getByText('너무맛있는곰장어집')).toBeInTheDocument();

    const pageButtons = screen.getAllByRole('button', { name: /Go to slide/i });

    act(() => {
      fireEvent.click(pageButtons[1]);
    });

    await waitFor(() => {
      expect(screen.getByText('여긴어디지고기집')).toBeInTheDocument();
    });

    act(() => {
      fireEvent.click(pageButtons[2]);
    });

    await waitFor(() => {
      expect(screen.getByText('메가메가메가커피')).toBeInTheDocument();
    });
  });

  it('활성 슬라이드의 첫 번째 이미지가 올바르게 렌더링된다', () => {
    render(<Carousel items={mockItems} />);

    const activeSlide = screen.getByRole('listitem', { current: true });
    const images = activeSlide.querySelectorAll('img');
    expect(images[0]).toHaveAttribute('alt', '너무맛있는곰장어집 - Image 1');
  });

  it('같은 슬라이드 클릭시 애니메이션 동작하지 않음', () => {
    render(<Carousel items={mockItems} />);

    expect(screen.getByText('너무맛있는곰장어집')).toBeInTheDocument();

    const pageButtons = screen.getAllByRole('button', { name: /Go to slide/i });
    const firstButton = pageButtons[0];

    act(() => {
      fireEvent.click(firstButton);
    });

    expect(screen.getByText('너무맛있는곰장어집')).toBeInTheDocument();
  });

  it('도트 네비게이션이 올바르게 활성화됨', () => {
    render(<Carousel items={mockItems} />);

    const pageButtons = screen.getAllByRole('button', { name: /Go to slide/i });

    expect(pageButtons[0]).toHaveClass('carousel__dots__active');
    expect(pageButtons[1]).toHaveClass('carousel__dots__inactive');
    expect(pageButtons[2]).toHaveClass('carousel__dots__inactive');
  });
  it('활성화된 슬라이드 접근성 테스트', () => {
    render(<Carousel items={mockItems} />);
    const activeItem = screen.getByRole('listitem', { current: true });
    expect(activeItem).toBeInTheDocument();
  });
  it('접근성 테스트', () => {
    render(<Carousel items={mockItems} />);

    const images = screen.getAllByRole('img');
    images.forEach(img => {
      expect(img).toHaveAttribute('alt');
    });

    const pageButtons = screen.getAllByRole('button', { name: /Go to slide/i });
    pageButtons.forEach((button, index) => {
      expect(button).toHaveAttribute('aria-label', `Go to slide ${index + 1}`);
    });
  });
});
