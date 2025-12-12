import { render, screen, fireEvent } from '@testing-library/react';

import TopTabs from '../TopTabs';

describe('TopTabs 컴포넌트 테스트', () => {
  const mockOnChange = jest.fn();

  beforeEach(() => {
    mockOnChange.mockClear();
  });

  test('모든 탭 버튼이 화면에 표시된다', () => {
    render(<TopTabs tab="roulette" onChange={mockOnChange} />);

    // 존재해야 하는 버튼 3개
    expect(screen.getByText('룰렛')).toBeInTheDocument();
    expect(screen.getByText('사다리타기')).toBeInTheDocument();
    expect(screen.getByText('지도')).toBeInTheDocument();
  });

  test('초기 값이 roulette이면 룰렛 탭이 active 상태여야 한다', () => {
    render(<TopTabs tab="roulette" onChange={mockOnChange} />);

    const rouletteTab = screen.getByRole('button', { name: '룰렛' });

    // active 클래스가 포함되어 있는지 확인
    expect(rouletteTab.className).toMatch(/tabButton--active/);
  });

  test('룰렛 탭 클릭 시 룰렛 호출', () => {
    render(<TopTabs tab="roulette" onChange={mockOnChange} />);

    const rouletteButton = screen.getByText('룰렛');
    fireEvent.click(rouletteButton);

    expect(mockOnChange).toHaveBeenCalledWith('roulette');
  });

  test('사다리타기 탭 클릭 시 onChange("ladder") 호출', () => {
    render(<TopTabs tab="ladder" onChange={mockOnChange} />);

    const ladderButton = screen.getByText('사다리타기');
    fireEvent.click(ladderButton);

    expect(mockOnChange).toHaveBeenCalledWith('ladder');
  });

  test('지도 탭 클릭 시 onChange("map") 호출', () => {
    render(<TopTabs tab="map" onChange={mockOnChange} />);

    const mapButton = screen.getByText('지도');
    fireEvent.click(mapButton);

    expect(mockOnChange).toHaveBeenCalledWith('map');
  });

  test('tab 값 변경 시 active 클래스가 올바르게 이동한다', () => {
    const { rerender } = render(<TopTabs tab="roulette" onChange={mockOnChange} />);

    const rouletteTab = screen.getByRole('button', { name: '룰렛' });

    // 초기에는 룰렛이 active
    expect(rouletteTab.className).toMatch(/tabButton--active/);

    rerender(<TopTabs tab="map" onChange={mockOnChange} />);

    const mapTab = screen.getByRole('button', { name: '지도' });

    expect(mapTab.className).toMatch(/tabButton--active/);
  });
});
