import { render, screen, fireEvent, act } from '@testing-library/react';
import RouletteUi from '../RouletteUi';

jest.useFakeTimers();

describe('RouletteUi Component', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('Canvas 렌더링됨', () => {
    render(<RouletteUi items={['A', 'B']} />);

    const canvas = screen.getByRole('img', { hidden: true });
    expect(canvas).toBeInTheDocument();
  });

  test('items가 1개면 클릭 시 바로 onResult 호출됨', () => {
    const onResult = jest.fn();

    render(<RouletteUi items={['라면']} onResult={onResult} />);

    const canvas = screen.getByRole('img', { hidden: true });

    fireEvent.click(canvas);

    act(() => {
      jest.advanceTimersByTime(500);
    });

    expect(onResult).toHaveBeenCalledWith('라면');
  });

  test('스핀 시작 시 onStart 호출됨', () => {
    const onStart = jest.fn();

    render(<RouletteUi items={['A', 'B']} onStart={onStart} />);

    const canvas = screen.getByRole('img', { hidden: true });

    fireEvent.click(canvas);

    expect(onStart).toHaveBeenCalled();
  });
});
