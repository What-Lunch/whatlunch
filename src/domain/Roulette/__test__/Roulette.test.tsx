import { render, screen, fireEvent } from '@testing-library/react';

import { Roulette } from '../Roulette';

jest.useFakeTimers();

jest.mock('../components/RouletteFilter', () => ({
  __esModule: true,
  default: ({ onChange, disabled }: any) => (
    <button
      data-testid="filter-btn"
      disabled={disabled}
      onClick={() => !disabled && onChange(['라면', '돈까스', '파스타'])}
    >
      필터 변경
    </button>
  ),
}));

jest.mock('../components/RouletteUi', () => ({
  __esModule: true,
  default: ({ items, onStart, onResult }: any) =>
    items.length > 1 ? (
      <button
        data-testid="spin-btn"
        onClick={() => {
          onStart?.();
          onResult('라면');
        }}
      >
        Spin
      </button>
    ) : null,
}));

jest.mock('../components/ResultModal', () => ({
  __esModule: true,
  default: ({ menu, onClose }: any) =>
    menu ? (
      <div data-testid="modal">
        <p>결과: {menu}</p>
        <button data-testid="close-btn" onClick={onClose}>
          닫기
        </button>
      </div>
    ) : null,
}));

const setup = (props = {}) =>
  render(<Roulette isSpinning={false} onSpinStart={() => {}} onSpinResult={() => {}} {...props} />);

describe('Roulette 통합 테스트', () => {
  test('필터 버튼 클릭 시 새로운 메뉴 리스트가 설정되고 Spin 버튼이 노출된다', () => {
    setup();

    fireEvent.click(screen.getByTestId('filter-btn'));

    expect(screen.getByTestId('spin-btn')).toBeInTheDocument();
  });

  test('Spin 버튼 클릭 시 onSpinStart와 onSpinResult 콜백이 정상적으로 호출된다', () => {
    const onStart = jest.fn();
    const onResult = jest.fn();

    setup({ onSpinStart: onStart, onSpinResult: onResult });

    fireEvent.click(screen.getByTestId('filter-btn'));
    fireEvent.click(screen.getByTestId('spin-btn'));

    expect(onStart).toHaveBeenCalledTimes(1);
    expect(onResult).toHaveBeenCalledWith('라면');
  });

  test('Spin 실행 후 결과 모달이 열린다', () => {
    setup();

    fireEvent.click(screen.getByTestId('filter-btn'));
    fireEvent.click(screen.getByTestId('spin-btn'));

    expect(screen.getByTestId('modal')).toBeInTheDocument();
    expect(screen.getByText('결과: 라면')).toBeInTheDocument();
  });

  test('모달 닫기 클릭 시 모달이 사라지고 “결과 보기” 버튼이 다시 표시된다 (state 초기화 검증)', () => {
    setup();

    fireEvent.click(screen.getByTestId('filter-btn'));
    fireEvent.click(screen.getByTestId('spin-btn'));
    fireEvent.click(screen.getByTestId('close-btn'));

    expect(screen.queryByTestId('modal')).not.toBeInTheDocument();
    expect(screen.getByText('결과 보기')).toBeInTheDocument();
  });

  test('스핀 중에는 필터 버튼이 비활성화되어 클릭해도 메뉴 변경이 일어나지 않는다', () => {
    setup({ isSpinning: true });

    const filterBtn = screen.getByTestId('filter-btn');

    expect(filterBtn).toBeDisabled();

    fireEvent.click(filterBtn);

    expect(screen.queryByTestId('spin-btn')).not.toBeInTheDocument();
  });
});
