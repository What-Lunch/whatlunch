import { render, screen, fireEvent } from '@testing-library/react';
import SignupModal from './SignupModal';

// 로그인과 회원가입 모달은 거의 동일한 구조이므로 회원가입 모달만 테스트합니다.
describe('회원가입', () => {
  const onClose = jest.fn();
  const onLoginOpen = jest.fn();

  beforeEach(() => {
    onClose.mockClear();
    onLoginOpen.mockClear();
  });

  it('입력 필드와 버튼들이 모두 렌더링된다', () => {
    render(<SignupModal onClose={onClose} onLoginOpen={onLoginOpen} />);
    expect(screen.getByText('이메일')).toBeInTheDocument();
    expect(screen.getByText('닉네임')).toBeInTheDocument();
    expect(screen.getAllByPlaceholderText(/비밀번호를 입력하세요/)).toHaveLength(2);
    expect(screen.getByRole('button', { name: /회원가입/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /닫기/i })).toBeInTheDocument();
    expect(screen.getByText(/로그인하기/)).toBeInTheDocument();
  });

  it('닫기 버튼 클릭 시 onClose가 호출된다', () => {
    render(<SignupModal onClose={onClose} onLoginOpen={onLoginOpen} />);
    fireEvent.click(screen.getByRole('button', { name: /닫기/i }));
    expect(onClose).toHaveBeenCalled();
  });

  it('"로그인하기" 클릭 시 onLoginOpen이 호출된다', () => {
    render(<SignupModal onClose={onClose} onLoginOpen={onLoginOpen} />);
    fireEvent.click(screen.getByText(/로그인하기/));
    expect(onLoginOpen).toHaveBeenCalled();
  });

  it('입력 값이 변경된다', () => {
    render(<SignupModal onClose={onClose} onLoginOpen={onLoginOpen} />);
    const emailInput = screen.getByPlaceholderText('이메일을 입력하세요');
    fireEvent.change(emailInput, { target: { value: 'test@example.com' } });
    expect(emailInput).toHaveValue('test@example.com');
  });

  it('비밀번호 입력시 비밀번호 확인 필드가 바뀌지 않는다', () => {
    render(<SignupModal onClose={onClose} onLoginOpen={onLoginOpen} />);
    const passwordInputs = screen.getAllByPlaceholderText('비밀번호를 입력하세요');
    fireEvent.change(passwordInputs[0], { target: { value: 'mypassword' } });
    expect(passwordInputs[0]).toHaveValue('mypassword');
    expect(passwordInputs[1]).toHaveValue('');
  });
  // input 가져오고 할게요
//   it('비밀번호 가시성 토글', () => {     
//     render(<SignupModal onClose={onClose} onLoginOpen={onLoginOpen} />);
//     const passwordInputs = screen.getAllByPlaceholderText('비밀번호를 입력하세요');
//     const toggleButtons = screen.getAllByRole('button', { name: 'icon-button' });

//     expect(passwordInputs[0]).toHaveAttribute('type', 'password');

//     fireEvent.click(toggleButtons[0]);
//     expect(passwordInputs[0]).toHaveAttribute('type', 'text');
//   });

  it('모달 외부 클릭 시 onClose가 호출된다', () => {
    render(<SignupModal onClose={onClose} onLoginOpen={onLoginOpen} />);
    const overlay = screen.getByRole('dialog');
    fireEvent.click(overlay);
    expect(onClose).toHaveBeenCalled();
  });
});
