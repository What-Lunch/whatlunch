import { render, screen, fireEvent } from '@testing-library/react';
import { MapPlace } from '../../../type';
import MapList from '../MapList';

describe('MapList UI', () => {
  test('리스트가 정상 렌더링된다', () => {
    const mockPlaces: MapPlace[] = [
      {
        id: '1',
        place_name: '식당 A',
        road_address_name: '주소 A',
        address_name: '주소 A',
        phone: '010-1111-2222',
        place_url: '#',
        x: '127.0',
        y: '37.0',
      },
      {
        id: '2',
        place_name: '카페 B',
        road_address_name: '주소 B',
        address_name: '주소 B',
        phone: '010-2222-3333',
        place_url: '#',
        x: '127.1',
        y: '37.1',
      },
    ];

    render(<MapList places={mockPlaces} activeId={null} onItemClick={() => {}} />);

    expect(screen.getByText('식당 A')).toBeInTheDocument();
    expect(screen.getByText('카페 B')).toBeInTheDocument();
  });

  test('아이템 클릭 시 onItemClick 호출된다', () => {
    const mockClick = jest.fn();

    const mockPlaces: MapPlace[] = [
      {
        id: '1',
        place_name: '식당 A',
        road_address_name: '',
        address_name: '',
        phone: '',
        place_url: '#',
        x: '0',
        y: '0',
      },
    ];

    render(<MapList places={mockPlaces} activeId={null} onItemClick={mockClick} />);

    fireEvent.click(screen.getByText('식당 A'));

    expect(mockClick).toHaveBeenCalledWith('1');
  });

  test('activeId가 적용되면 해당 아이템이 active 클래스를 가진다', () => {
    const mockPlaces: MapPlace[] = [
      {
        id: '1',
        place_name: '활성 식당',
        road_address_name: '',
        address_name: '',
        phone: '',
        place_url: '#',
        x: '0',
        y: '0',
      },
    ];

    render(<MapList places={mockPlaces} activeId="1" onItemClick={() => {}} />);

    const item = screen.getByText('활성 식당').parentElement!;
    expect(item.className).toMatch(/list__item--active/);
  });

  test('도로명 주소가 없으면 address_name을 표시한다', () => {
    const mockPlaces: MapPlace[] = [
      {
        id: '1',
        place_name: '식당 A',
        road_address_name: '',
        address_name: '지번 주소 A',
        phone: '',
        place_url: '#',
        x: '0',
        y: '0',
      },
    ];

    render(<MapList places={mockPlaces} activeId={null} onItemClick={() => {}} />);

    expect(screen.getByText('지번 주소 A')).toBeInTheDocument();
  });

  test('전화번호가 없는 경우 "전화번호 없음"이 렌더링된다', () => {
    const mockPlaces: MapPlace[] = [
      {
        id: '1',
        place_name: '식당 A',
        road_address_name: '',
        address_name: '',
        phone: '',
        place_url: '#',
        x: '0',
        y: '0',
      },
    ];

    render(<MapList places={mockPlaces} activeId={null} onItemClick={() => {}} />);

    expect(screen.getByText('전화번호 없음')).toBeInTheDocument();
  });

  test('place_url 링크가 올바르게 렌더링된다', () => {
    const mockPlaces = [
      {
        id: '1',
        place_name: '식당 A',
        road_address_name: '',
        address_name: '',
        phone: '',
        place_url: 'https://test.com',
        x: '0',
        y: '0',
      },
    ];

    const { container } = render(
      <MapList places={mockPlaces} activeId={null} onItemClick={() => {}} />
    );

    const detailLink = container.querySelector('.list__item__detail')!;
    expect(detailLink).toHaveAttribute('href', 'https://test.com');
  });

  test('activeId가 바뀌면 active 클래스가 새 아이템에 적용된다', () => {
    const mockPlaces: MapPlace[] = [
      {
        id: '1',
        place_name: 'A',
        road_address_name: '',
        address_name: '',
        phone: '',
        place_url: '#',
        x: '0',
        y: '0',
      },
      {
        id: '2',
        place_name: 'B',
        road_address_name: '',
        address_name: '',
        phone: '',
        place_url: '#',
        x: '0',
        y: '0',
      },
    ];

    const { rerender } = render(
      <MapList places={mockPlaces} activeId="1" onItemClick={() => {}} />
    );

    expect(screen.getByText('A').parentElement).toHaveClass('list__item--active');

    rerender(<MapList places={mockPlaces} activeId="2" onItemClick={() => {}} />);

    expect(screen.getByText('B').parentElement).toHaveClass('list__item--active');
  });
});
