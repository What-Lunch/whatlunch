import { render, screen, fireEvent } from '@testing-library/react';
import RouletteFilter from '../RouletteFilter';
import { pickMenus } from '@/shared/utils/recommend/pickMenus';

// pickMenus mock
jest.mock('@/shared/utils/recommend/pickMenus', () => ({
  pickMenus: jest.fn(() => [{ name: '메뉴A' }, { name: '메뉴B' }]),
}));

jest.mock('@/shared/constants/filters', () => ({
  FILTER_CONFIG: {
    food: {
      label: '음식 종류',
      options: [
        { value: '전체', label: '전체' },
        { value: '한식', label: '한식' },
        { value: '중식', label: '중식' },
      ],
      icons: {
        전체: 'ICON_ALL',
        한식: 'ICON_KOREAN',
        중식: 'ICON_CHINESE',
      },
    },
    situation: {
      label: '상황별',
      options: [
        { value: '혼밥', label: '혼밥' },
        { value: '가성비', label: '가성비' },
      ],
      icons: {
        혼밥: 'ICON_ALONE',
        가성비: 'ICON_VALUE',
      },
    },
  },
}));

describe('RouletteFilter UI 동작 테스트', () => {
  const mockChange = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  const setup = () => render(<RouletteFilter onChange={mockChange} />);

  // -------------------------------------------------------------
  test('초기에는 음식 필터 옵션 목록이 정상 렌더링된다', () => {
    setup();

    expect(screen.getByRole('button', { name: '음식 종류' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /전체/ })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /한식/ })).toBeInTheDocument();
  });

  // -------------------------------------------------------------
  test('사용자가 음식 옵션을 클릭하면 pickMenus와 onChange가 호출된다', () => {
    setup();

    const koreanBtn = screen.getByRole('button', { name: /한식/ });
    fireEvent.click(koreanBtn);

    expect(pickMenus).toHaveBeenCalled();
    expect(mockChange).toHaveBeenCalledWith(['메뉴A', '메뉴B']);
  });

  // -------------------------------------------------------------
  test('음식 옵션을 클릭하면 해당 버튼이 활성화(filled) 상태가 된다', () => {
    setup();

    const koreanBtn = screen.getByRole('button', { name: /한식/ });
    fireEvent.click(koreanBtn);

    expect(koreanBtn).toHaveClass('button--fill');
  });

  // -------------------------------------------------------------
  test('전체를 누르면 음식 선택 상태가 초기화되고 pickMenus가 다시 실행된다', () => {
    setup();

    fireEvent.click(screen.getByRole('button', { name: /한식/ }));
    fireEvent.click(screen.getByRole('button', { name: /전체/ }));

    expect(pickMenus).toHaveBeenCalledTimes(2);
    expect(mockChange).toHaveBeenLastCalledWith(['메뉴A', '메뉴B']);
  });

  // -------------------------------------------------------------
  test('상황별 모드로 전환하면 음식 옵션 대신 상황 옵션 목록이 표시된다', () => {
    setup();

    fireEvent.click(screen.getByRole('button', { name: '상황별' }));

    expect(screen.getByRole('button', { name: /혼밥/ })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /가성비/ })).toBeInTheDocument();
  });

  // -------------------------------------------------------------
  test('food → situation 모드 전환 시 food isActive 상태가 초기화된다', () => {
    setup();

    const koreanBtn = screen.getByRole('button', { name: /한식/ });
    fireEvent.click(koreanBtn);

    expect(koreanBtn).toHaveClass('button--fill'); // 활성화됨

    fireEvent.click(screen.getByRole('button', { name: '상황별' }));
    fireEvent.click(screen.getByRole('button', { name: '음식 종류' })); // 다시 food로 복귀

    // 전체가 기본 선택이므로 "한식"은 비활성화 상태여야 함
    expect(screen.getByRole('button', { name: /한식/ })).toHaveClass('button--outline');
  });

  // -------------------------------------------------------------
  test('모드를 변경하면 반대쪽 선택된 필터는 초기화된다', () => {
    setup();

    fireEvent.click(screen.getByRole('button', { name: /한식/ }));
    fireEvent.click(screen.getByRole('button', { name: '상황별' }));

    expect(screen.getByRole('button', { name: /혼밥/ })).toBeInTheDocument();
  });

  // -------------------------------------------------------------
  test('비활성화된 상태에서는 클릭해도 pickMenus와 onChange가 실행되지 않는다', () => {
    render(<RouletteFilter onChange={mockChange} disabled />);

    fireEvent.click(screen.getByRole('button', { name: /한식/ }));

    expect(pickMenus).not.toHaveBeenCalled();
    expect(mockChange).not.toHaveBeenCalled();
  });

  // -------------------------------------------------------------
  test('렌더링되는 옵션 목록은 FILTER_CONFIG 값에 따라 결정된다', () => {
    setup();

    expect(screen.getByRole('button', { name: /전체/ })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /한식/ })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /중식/ })).toBeInTheDocument();
  });
});
