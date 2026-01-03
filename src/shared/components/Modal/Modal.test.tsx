import { render, screen, fireEvent } from '@testing-library/react';
import Modal from './Modal';

describe('Modal', () => {
  const onClose = jest.fn();

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('renders title and description when open', () => {
    render(
      <Modal isOpen={true} onClose={onClose} title="타이틀" description="설명">
        <div>모달 내용</div>
      </Modal>
    );
    expect(screen.getByText('타이틀')).toBeInTheDocument();
    expect(screen.getByText('설명')).toBeInTheDocument();
    expect(screen.getByText('모달 내용')).toBeInTheDocument();
  });

  it('does not render when isOpen is false', () => {
    render(
      <Modal isOpen={false} onClose={onClose} title="타이틀">
        <div>모달 내용</div>
      </Modal>
    );
    expect(screen.queryByText('타이틀')).not.toBeInTheDocument();
    expect(screen.queryByText('모달 내용')).not.toBeInTheDocument();
  });

  it('calls onClose when close button is clicked', () => {
    render(
      <Modal isOpen={true} onClose={onClose} title="타이틀">
        <div>모달 내용</div>
      </Modal>
    );
    const closeBtn = screen.getByRole('button', { name: /닫기/i });
    fireEvent.click(closeBtn);
    expect(onClose).toHaveBeenCalled();
  });

  it('calls onClose when overlay is clicked', () => {
    render(
      <Modal isOpen={true} onClose={onClose} title="타이틀">
        <div>모달 내용</div>
      </Modal>
    );
    // overlay는 section
    const overlay = screen.getByRole('dialog');
    fireEvent.click(overlay);
    expect(onClose).toHaveBeenCalled();
  });

  it('calls onClose when ESC key is pressed', () => {
    render(
      <Modal isOpen={true} onClose={onClose} title="타이틀">
        <div>모달 내용</div>
      </Modal>
    );
    fireEvent.keyDown(window, { key: 'Escape', code: 'Escape' });
    expect(onClose).toHaveBeenCalled();
  });
});
