import { render, screen, fireEvent } from '@testing-library/react';
import RouletteFilter from '../RouletteFilter';

jest.mock('@/shared/utils/recommend/pickMenus', () => ({
  pickMenus: jest.fn(() => [{ name: '메뉴A' }, { name: '메뉴B' }]),
}));

jest.mock('@/shared/constants/filters', () => ({
  FOOD_TYPE_FILTERS: ['전체', '한식', '중식'],
  SITUATION_FILTERS: ['혼밥', '가성비'],
}));

jest.mock('@/shared/constants/icons', () => ({
  FOOD_TYPE_ICONS: {
    전체: 'ALL_ICON',
    한식: 'KOREAN_ICON',
    중식: 'CHINESE_ICON',
  },
  SITUATION_ICONS: {
    혼밥: 'ALONE_ICON',
    가성비: 'VALUE_ICON',
  },
}));

describe('RouletteFilter UI', () => {
  const mockChange = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  const setup = () => render(<RouletteFilter onChange={mockChange} disabled={false} />);

  test('초기 화면은 음식 종류 모드이며 기본으로 "전체"가 활성화', () => {
    setup();

    expect(screen.getByRole('button', { name: '음식 종류' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: '상황별' })).toBeInTheDocument();

    expect(screen.getByRole('button', { name: /전체/ })).toBeInTheDocument();
  });

  test('음식 종류 필터 선택 시 pickMenus 호출 → onChange 호출', () => {
    setup();

    const koreanBtn = screen.getByRole('button', { name: /한식/ });
    fireEvent.click(koreanBtn);

    expect(mockChange).toHaveBeenCalledWith(['메뉴A', '메뉴B']);
  });

  test('"전체" 선택 시 모든 foodType 초기화', () => {
    setup();

    fireEvent.click(screen.getByRole('button', { name: /한식/ }));

    fireEvent.click(screen.getByRole('button', { name: /전체/ }));

    expect(mockChange).toHaveBeenCalledWith(['메뉴A', '메뉴B']);
  });

  test('상황별 모드 전환 시 음식 필터 초기화됨', () => {
    setup();

    fireEvent.click(screen.getByRole('button', { name: /한식/ }));

    fireEvent.click(screen.getByRole('button', { name: '상황별' }));
    expect(screen.getByRole('button', { name: /혼밥/ })).toBeInTheDocument();
  });

  test('상황별 필터 클릭 시 pickMenus 호출 → onChange 호출', () => {
    setup();

    fireEvent.click(screen.getByRole('button', { name: '상황별' }));
    fireEvent.click(screen.getByRole('button', { name: /혼밥/ }));

    expect(mockChange).toHaveBeenCalledWith(['메뉴A', '메뉴B']);
  });

  test('disabled=true 인 경우 필터 클릭 불가', () => {
    render(<RouletteFilter onChange={mockChange} disabled={true} />);

    fireEvent.click(screen.getByRole('button', { name: /한식/ }));
    fireEvent.click(screen.getByRole('button', { name: /전체/ }));

    expect(mockChange).not.toHaveBeenCalled();
  });
});
