import { render, screen } from '@testing-library/react';
import { act } from 'react';
import Clock from '@/components/Clock';

// formatRemain mock
jest.mock('@/components/Clock/formatRemain', () => ({
  formatRemain: (remain: string) => `포맷(${remain})`,
}));

// 메시지 mock
jest.mock('@/components/Clock/clockMessages', () => ({
  getBeforeLunchMessage: (remain: string) => `전(포맷(${remain}))`,
  getAfterLunchMessage: () => `후`,
}));

describe('Clock Component', () => {
  beforeAll(() => {
    jest.useFakeTimers();
  });

  afterAll(() => {
    jest.useRealTimers();
  });

  test('점심 이전이면 getBeforeLunchMessage(remain)이 출력된다', () => {
    jest.setSystemTime(new Date('2025-11-23T10:00:00'));

    render(<Clock />);

    act(() => {
      jest.advanceTimersByTime(1000);
    });

    expect(screen.getByText(/^전/)).toBeInTheDocument(); // "오전" 중복 방지
  });

  test('점심 이후이면 getAfterLunchMessage()가 출력된다', () => {
    jest.setSystemTime(new Date('2025-11-23T13:00:00'));

    render(<Clock />);

    act(() => {
      jest.advanceTimersByTime(1000);
    });

    expect(screen.getByText(/^후$/)).toBeInTheDocument();
  });

  test('formatRemain 결과가 메시지에 포함된다', () => {
    jest.setSystemTime(new Date('2025-11-23T09:30:00'));

    render(<Clock />);

    act(() => {
      jest.advanceTimersByTime(1000);
    });

    expect(screen.getByText(/포맷/)).toBeInTheDocument();
  });

  test('현재 시간이 시계에 표시된다', () => {
    jest.setSystemTime(new Date('2025-11-23T09:10:30'));

    render(<Clock />);

    act(() => {
      jest.advanceTimersByTime(1000);
    });

    expect(screen.getByText(/9:10/)).toBeInTheDocument();
  });
});
