import { render, screen, fireEvent, act, waitFor } from '@testing-library/react';
import Carousel from '@/shared/components/Carousel';
import styles from '@/shared/components/Carousel/Carousel.module.scss';
import { StaticImageData } from 'next/image';

const mockImage: StaticImageData = {
  src: '/test-image.jpg',
  height: 100,
  width: 100,
  blurDataURL: '',
};

const mockItems = [
  {
    id: 'item-1',
    src: [mockImage, mockImage, mockImage, mockImage, mockImage],
    title: '너무맛있는곰장어집',
    category: '식당',
    rating: 4.5,
    location: '서울 마포',
  },
  {
    id: 'item-2',
    src: [mockImage, mockImage, mockImage, mockImage, mockImage],
    title: '여긴어디지고기집',
    category: '식당',
    rating: 4.0,
    location: '서울 강남',
  },
  {
    id: 'item-3',
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

  it('초기 렌더링 시 첫 번째 아이템이 표시된다', () => {
    render(<Carousel items={mockItems} />);
    expect(screen.getByText('너무맛있는곰장어집')).toBeInTheDocument();
  });

  it('dot 클릭 시 슬라이드가 변경된다', async () => {
    render(<Carousel items={mockItems} />);

    const pageButtons = screen.getAllByRole('button', { name: /Go to slide/i });

    act(() => {
      fireEvent.click(pageButtons[1]);
    });

    await waitFor(() => {
      expect(screen.getByText('여긴어디지고기집')).toBeInTheDocument();
    });
  });

  it('도트 네비게이션 active 상태가 올바르게 변경된다', () => {
    render(<Carousel items={mockItems} />);

    const pageButtons = screen.getAllByRole('button', { name: /Go to slide/i });

    expect(pageButtons[0]).toHaveClass(styles['dots__active']);
    expect(pageButtons[1]).toHaveClass(styles['dots__inactive']);

    fireEvent.click(pageButtons[2]);

    expect(pageButtons[2]).toHaveClass(styles['dots__active']);
    expect(pageButtons[0]).toHaveClass(styles['dots__inactive']);
  });

  it('활성화된 dot에는 aria-current가 적용된다', () => {
    render(<Carousel items={mockItems} />);

    const pageButtons = screen.getAllByRole('button', { name: /Go to slide/i });

    expect(pageButtons[0]).toHaveAttribute('aria-current', 'true');
    expect(pageButtons[1]).not.toHaveAttribute('aria-current');
  });

  it('이미지에는 alt 속성이 항상 존재한다', () => {
    render(<Carousel items={mockItems} />);

    const images = screen.getAllByRole('img');
    images.forEach(img => {
      expect(img).toHaveAttribute('alt');
    });
  });

  it('즐겨찾기 버튼 클릭 시 aria-pressed가 토글된다', () => {
    render(<Carousel items={mockItems} />);

    const favoriteButton = screen.getByLabelText('너무맛있는곰장어집 즐겨찾기 추가');

    expect(favoriteButton).toHaveAttribute('aria-pressed', 'false');

    fireEvent.click(favoriteButton);

    expect(favoriteButton).toHaveAttribute('aria-pressed', 'true');
  });
});
