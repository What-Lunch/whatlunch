import { render, screen, fireEvent } from '@testing-library/react';
import ResultModal from '../ResultModal';

const mockShare = jest.fn();
const originalShare = navigator.share;

const mockAlert = jest.fn();
global.alert = mockAlert;

describe('ResultModal UI', () => {
  const mockClose = jest.fn();

  const setup = () => render(<ResultModal menu="라멘" onClose={mockClose} />);

  beforeEach(() => {
    jest.clearAllMocks();
  });

  afterAll(() => {
    navigator.share = originalShare;
  });

  test('모달이 정상 렌더링된다', () => {
    setup();

    expect(screen.getByText('라멘')).toBeInTheDocument();
    expect(screen.getByRole('dialog')).toBeInTheDocument();
  });

  test('오버레이 클릭 시 onClose 호출', () => {
    setup();

    fireEvent.click(screen.getByRole('dialog').parentElement!);
    expect(mockClose).toHaveBeenCalled();
  });

  test('ESC 키 입력 시 onClose 호출', () => {
    setup();

    fireEvent.keyDown(window, { key: 'Escape' });
    expect(mockClose).toHaveBeenCalled();
  });

  test('닫기 버튼 클릭 시 onClose 호출', () => {
    setup();

    fireEvent.click(screen.getByRole('button', { name: '닫기' }));
    expect(mockClose).toHaveBeenCalled();
  });

  test('공유하기 버튼 클릭 - navigator.share 지원 시 share 호출', async () => {
    navigator.share = mockShare;

    setup();

    fireEvent.click(screen.getByRole('button', { name: '공유하기' }));

    expect(mockShare).toHaveBeenCalledWith({
      title: '오늘의 메뉴',
      text: '오늘의 메뉴는 라멘입니다!',
    });
  });

  test('공유하기 버튼 클릭 - navigator.share 미지원 시 alert 호출', () => {
    navigator.share = undefined as any;

    setup();

    fireEvent.click(screen.getByRole('button', { name: '공유하기' }));

    expect(mockAlert).toHaveBeenCalledWith('공유 기능을 지원하지 않는 브라우저입니다.');
  });
});
