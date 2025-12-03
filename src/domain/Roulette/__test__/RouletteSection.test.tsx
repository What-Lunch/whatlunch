import { render, screen, fireEvent } from '@testing-library/react';
import { RouletteSection } from '../RouletteSection';

jest.useFakeTimers();

interface FilterProps {
  onChange: (items: string[]) => void;
  disabled: boolean;
}

interface ResultModalProps {
  menu: string;
  onClose: () => void;
}

interface RouletteUiProps {
  items: string[];
  onStart?: () => void;
  onResult: (value: string) => void;
}

jest.mock('../components/RouletteFilter', () => ({
  __esModule: true,
  default: (props: FilterProps) => (
    <button
      disabled={props.disabled}
      onClick={() => {
        if (!props.disabled) {
          props.onChange(['라면', '돈까스', '파스타']);
        }
      }}
    >
      필터 변경
    </button>
  ),
}));

jest.mock('../components/RouletteUi', () => ({
  __esModule: true,
  default: ({ items, onResult }: RouletteUiProps) =>
    items.length > 1 ? <button onClick={() => onResult('라면')}>Spin</button> : null,
}));

jest.mock('../components/ResultModal', () => ({
  __esModule: true,
  default: (props: ResultModalProps) => (
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

  test('스핀 중에는 필터 버튼이 비활성화되어 메뉴가 변경되지 않음', () => {
    render(<RouletteSection isSpinning={true} onSpinStart={() => {}} onSpinResult={() => {}} />);

    const filterBtn = screen.getByText('필터 변경');

    expect(filterBtn).toBeDisabled();

    fireEvent.click(filterBtn);

    expect(screen.queryByText('Spin')).not.toBeInTheDocument();
  });
  test('결과 보기 버튼 클릭 시 모달 열림', () => {
    render(<RouletteSection isSpinning={false} onSpinStart={() => {}} onSpinResult={() => {}} />);

    fireEvent.click(screen.getByText('필터 변경'));
    fireEvent.click(screen.getByText('Spin'));

    fireEvent.click(screen.getByText('닫기'));

    fireEvent.click(screen.getByText('결과 보기'));

    expect(screen.getByText('결과: 라면')).toBeInTheDocument();
  });
});
