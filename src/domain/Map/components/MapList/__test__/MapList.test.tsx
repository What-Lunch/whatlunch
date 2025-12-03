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

    const activeItem = screen.getByText('활성 식당').parentElement!;

    expect(activeItem.className).toMatch(/active/i);
  });
});
