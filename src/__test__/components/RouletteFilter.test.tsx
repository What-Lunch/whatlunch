import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import RouletteFilter from '@/domain/Roulette/components/RouletteFilter/RouletteFilter';
import { pickMenus } from '@/shared/utils/recommend/pickMenus';

jest.mock('@/utils/pickMenus', () => ({
  pickMenus: jest.fn(() => [{ name: '테스트메뉴1' }, { name: '테스트메뉴2' }]),
}));

describe('RouletteFilter 최소 기능 테스트', () => {
  const onChange = jest.fn();

  beforeEach(() => {
    onChange.mockClear();
    (pickMenus as jest.Mock).mockClear();
  });

  test('전체 클릭 시 전체만 남는다', () => {
    render(<RouletteFilter onChange={onChange} />);

    const chinese = screen.getByRole('button', { name: /중식/ });
    const allBtn = screen.getByRole('button', { name: /^전체$/ });

    fireEvent.click(chinese);
    fireEvent.click(allBtn);

    expect(pickMenus).toHaveBeenLastCalledWith(['전체'], null);
  });

  test('전체 선택 상태에서 중식 클릭 시 전체 제거 후 중식만 남는다', () => {
    render(<RouletteFilter onChange={onChange} />);

    const chinese = screen.getByRole('button', { name: /중식/ });

    fireEvent.click(chinese);

    expect(pickMenus).toHaveBeenLastCalledWith(['중식'], null);
  });

  test('중식 + 양식 다중 선택 가능하다', () => {
    render(<RouletteFilter onChange={onChange} />);

    const chinese = screen.getByRole('button', { name: /중식/ });
    const western = screen.getByRole('button', { name: /양식/ });

    fireEvent.click(chinese);
    fireEvent.click(western);

    expect(pickMenus).toHaveBeenLastCalledWith(['중식', '양식'], null);
  });

  test('상황 선택은 단일이며 다시 클릭하면 해제(null)', () => {
    render(<RouletteFilter onChange={onChange} />);

    const situationTab = screen.getByRole('button', { name: /상황별/ });
    fireEvent.click(situationTab);

    const dateBtn = screen.getByRole('button', { name: /데이트/ });

    fireEvent.click(dateBtn);
    expect(pickMenus).toHaveBeenLastCalledWith(['전체'], '데이트');

    fireEvent.click(dateBtn);
    expect(pickMenus).toHaveBeenLastCalledWith(['전체'], null);
  });

  test('food → situation 모드 이동 시 food 선택 초기화', () => {
    render(<RouletteFilter onChange={onChange} />);

    const chinese = screen.getByRole('button', { name: /중식/ });
    fireEvent.click(chinese);

    const situationTab = screen.getByRole('button', { name: /상황별/ });
    fireEvent.click(situationTab);

    expect(pickMenus).toHaveBeenLastCalledWith(['전체'], null);
  });

  test('disabled=true 시 모든 interaction이 차단된다', () => {
    render(<RouletteFilter onChange={onChange} disabled />);

    const chinese = screen.getByRole('button', { name: /중식/ });
    const situationTab = screen.getByRole('button', { name: /상황별/ });

    fireEvent.click(chinese);
    fireEvent.click(situationTab);

    expect(pickMenus).not.toHaveBeenCalled();
    expect(onChange).not.toHaveBeenCalled();
  });
});
