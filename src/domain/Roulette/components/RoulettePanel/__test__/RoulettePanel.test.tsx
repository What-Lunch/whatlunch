import { render, screen, fireEvent } from '@testing-library/react';
import RoulettePanel from '../RoulettePanel';
interface RouletteUiProps {
  onResult: (value: string) => void;
}

interface ResultModalProps {
  menu: string;
  onClose: () => void;
}

jest.mock('../../RouletteUi/RouletteUi', () => ({
  __esModule: true,
  default: (props: RouletteUiProps) => (
    <button onClick={() => props.onResult('TEST_RESULT')}>Spin</button>
  ),
}));

jest.mock('../../ResultModal/ResultModal', () => ({
  __esModule: true,
  default: (props: ResultModalProps) => (
    <div>
      <p>RESULT: {props.menu}</p>
      <button onClick={props.onClose}>Close</button>
    </div>
  ),
}));

describe('RoulettePanel UI', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('입력창에 문자열 입력하면 값 변경됨', () => {
    render(<RoulettePanel />);

    const input = screen.getByPlaceholderText('메뉴 입력');

    fireEvent.change(input, { target: { value: '라면' } });

    expect(input).toHaveValue('라면');
  });

  test('추가 버튼 클릭 시 리스트에 메뉴가 추가됨', () => {
    render(<RoulettePanel />);

    const input = screen.getByPlaceholderText('메뉴 입력');
    const addBtn = screen.getByRole('button', { name: '추가' });

    fireEvent.change(input, { target: { value: '라면' } });
    fireEvent.click(addBtn);

    expect(screen.getByText('라면')).toBeInTheDocument();
  });

  test('중복 입력 시 isDuplicate 상태로 인해 추가되지 않음', () => {
    render(<RoulettePanel />);

    const input = screen.getByPlaceholderText('메뉴 입력');
    const addBtn = screen.getByRole('button', { name: '추가' });

    fireEvent.change(input, { target: { value: '라면' } });
    fireEvent.click(addBtn);

    fireEvent.change(input, { target: { value: '라면' } });
    fireEvent.click(addBtn);

    const items = screen.getAllByText('라면');
    expect(items.length).toBe(1);
  });

  test('리스트의 삭제 버튼 클릭 시 해당 항목 삭제됨', () => {
    render(<RoulettePanel />);

    const input = screen.getByPlaceholderText('메뉴 입력');
    const addBtn = screen.getByRole('button', { name: '추가' });

    fireEvent.change(input, { target: { value: '라면' } });
    fireEvent.click(addBtn);

    const deleteBtn = screen.getByRole('button', { name: '삭제' });

    fireEvent.click(deleteBtn);

    expect(screen.queryByText('라면')).toBeNull();
  });

  test('초기화 버튼 클릭 시 전체 항목 사라짐', () => {
    render(<RoulettePanel />);

    const input = screen.getByPlaceholderText('메뉴 입력');
    const addBtn = screen.getByRole('button', { name: '추가' });
    const resetBtn = screen.getByRole('button', { name: '초기화' });

    fireEvent.change(input, { target: { value: '라면' } });
    fireEvent.click(addBtn);

    fireEvent.change(input, { target: { value: '돈까스' } });
    fireEvent.click(addBtn);

    fireEvent.click(resetBtn);

    expect(screen.queryByText('라면')).toBeNull();
    expect(screen.queryByText('돈까스')).toBeNull();
  });

  test('Roulette 스핀 결과가 나오면 ResultModal 표시됨', () => {
    render(<RoulettePanel />);

    fireEvent.click(screen.getByText('Spin'));

    expect(screen.getByText('RESULT: TEST_RESULT')).toBeInTheDocument();
  });

  test('ResultModal에서 닫기 버튼 클릭 시 모달 닫힘', () => {
    render(<RoulettePanel />);

    fireEvent.click(screen.getByText('Spin'));

    const closeBtn = screen.getByRole('button', { name: 'Close' });
    fireEvent.click(closeBtn);

    expect(screen.queryByText('RESULT: TEST_RESULT')).toBeNull();
  });
});
