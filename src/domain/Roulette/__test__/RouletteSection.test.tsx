import { render, screen, fireEvent } from '@testing-library/react';
import { RouletteSection } from '../RouletteSection';

jest.useFakeTimers();

interface FilterProps {
  onChange: (items: string[]) => void;
  disabled: boolean;
}

interface RouletteProps {
  onResult: (value: string) => void;
}

interface ResultModalProps {
  menu: string;
  onClose: () => void;
}

jest.mock('../components/RouletteFilter', () => ({
  __esModule: true,
  RouletteFilter: (props: FilterProps) => (
    <button disabled={props.disabled} onClick={() => props.onChange(['라면', '돈까스', '파스타'])}>
      필터 변경
    </button>
  ),
}));

jest.mock('../components/RouletteUi', () => ({
  __esModule: true,
  Roulette: (props: RouletteProps) => <button onClick={() => props.onResult('라면')}>Spin</button>,
}));

jest.mock('../components/ResultModal', () => ({
  __esModule: true,
  ResultModal: (props: ResultModalProps) => (
    <div>
      <p>결과: {props.menu}</p>
      <button onClick={props.onClose}>닫기</button>
    </div>
  ),
}));

describe('RouletteSection 통합 테스트', () => {
  test('필터 클릭 → 메뉴 변경됨', () => {
    render(<RouletteSection isSpinning={false} onSpinStart={() => {}} onSpinResult={() => {}} />);

    const filterBtn = screen.getByText('필터 변경');
    fireEvent.click(filterBtn);

    expect(screen.getByText('Spin')).toBeInTheDocument();
  });

  test('룰렛 스핀 → 결과 모달 열림', () => {
    render(<RouletteSection isSpinning={false} onSpinStart={() => {}} onSpinResult={() => {}} />);

    fireEvent.click(screen.getByText('필터 변경'));
    fireEvent.click(screen.getByText('Spin'));

    expect(screen.getByText('결과: 라면')).toBeInTheDocument();
  });

  test('결과 모달 닫기 동작', () => {
    render(<RouletteSection isSpinning={false} onSpinStart={() => {}} onSpinResult={() => {}} />);

    fireEvent.click(screen.getByText('필터 변경'));
    fireEvent.click(screen.getByText('Spin'));

    fireEvent.click(screen.getByText('닫기'));

    expect(screen.queryByText('결과: 라면')).not.toBeInTheDocument();
  });
});
