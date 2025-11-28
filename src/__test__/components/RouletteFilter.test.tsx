import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import RouletteFilter from '@/components/Roulette/RouletteFilter/RouletteFilter';
import { pickMenus } from '@/components/Roulette/RouletteFilter/categories';

jest.mock('@/components/Roulette/RouletteFilter/categories', () => ({
  ...jest.requireActual('@/components/Roulette/RouletteFilter/categories'),
  pickMenus: jest.fn(() => [{ name: '테스트메뉴1' }, { name: '테스트메뉴2' }]),
}));

describe('RouletteFilter - 필터 기능 테스트', () => {
  const onChange = jest.fn();

  beforeEach(() => {
    onChange.mockClear();
    (pickMenus as jest.Mock).mockClear();
  });

  test('전체 클릭 시 모든 선택이 초기화되어 전체가 된다', () => {
    render(<RouletteFilter onChange={onChange} />);

    const chinese = screen.getByRole('button', { name: /중식/ });
    const allBtn = screen.getByRole('button', { name: /^전체$/ });

    fireEvent.click(chinese);
    fireEvent.click(allBtn);

    expect(allBtn).toHaveClass('button--fill');
    expect(chinese).toHaveClass('button--outline');

    expect(pickMenus).toHaveBeenCalledWith(['전체'], null);
  });

  test('전체 선택 상태에서 중식 클릭 시 전체 해제되고 중식만 남는다', () => {
    render(<RouletteFilter onChange={onChange} />);

    const chinese = screen.getByRole('button', { name: /중식/ });

    fireEvent.click(chinese);

    expect(pickMenus).toHaveBeenCalledWith(['중식'], null);
  });

  test('중식 + 양식 다중 선택 유지된다', () => {
    render(<RouletteFilter onChange={onChange} />);

    const chinese = screen.getByRole('button', { name: /중식/ });
    const western = screen.getByRole('button', { name: /양식/ });

    fireEvent.click(chinese);
    fireEvent.click(western);

    expect(pickMenus).toHaveBeenLastCalledWith(['중식', '양식'], null);
  });

  test('상황 필터는 단일 선택이며 다시 클릭하면 해제된다', () => {
    render(<RouletteFilter onChange={onChange} />);

    const situationTab = screen.getByText('상황별');
    fireEvent.click(situationTab);

    const dateBtn = screen.getByRole('button', { name: /데이트/ });

    fireEvent.click(dateBtn);
    expect(pickMenus).toHaveBeenLastCalledWith(['전체'], '데이트');

    fireEvent.click(dateBtn);
    expect(pickMenus).toHaveBeenLastCalledWith(['전체'], null);
  });

  test('음식 타입 + 상황 필터 조합이 pickMenus에 정확히 전달된다', () => {
    render(<RouletteFilter onChange={onChange} />);

    const chinese = screen.getByRole('button', { name: /중식/ });
    const situationTab = screen.getByText('상황별');

    fireEvent.click(chinese);

    fireEvent.click(situationTab);
    const dateBtn = screen.getByRole('button', { name: /데이트/ });
    fireEvent.click(dateBtn);

    expect(pickMenus).toHaveBeenLastCalledWith(['중식'], '데이트');
  });

  test('disabled=true이면 모든 필터 interaction이 차단된다', () => {
    render(<RouletteFilter onChange={onChange} disabled={true} />);

    const chinese = screen.getByRole('button', { name: /중식/ });
    const situationTab = screen.getByText('상황별');

    fireEvent.click(chinese);
    fireEvent.click(situationTab);

    expect(onChange).not.toHaveBeenCalled();
    expect(pickMenus).not.toHaveBeenCalled();
  });
});
