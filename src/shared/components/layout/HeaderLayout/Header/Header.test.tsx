import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import Header from '@/shared/components/layout/HeaderLayout/Header';
import { useRouter } from 'next/router';

// next/link 때문에 router mocking 필요
jest.mock('next/router', () => ({
  useRouter: jest.fn(),
}));

describe('Header 컴포넌트', () => {
  beforeEach(() => {
    (useRouter as jest.Mock).mockReturnValue({
      pathname: '/',
      push: jest.fn(),
    });
  });

  it('로고와 텍스트가 화면에 렌더링 되는지 확인', () => {
    render(<Header />);
    const logoImg = screen.getByAltText('What Lunch Logo');
    const logoText = screen.getByText('What Lunch');

    expect(logoImg).toBeInTheDocument();
    expect(logoText).toBeInTheDocument();
  });

  it('메뉴 링크들이 화면에 있는지 확인', () => {
    render(<Header />);
    expect(screen.getByText('룰렛 돌리기')).toBeInTheDocument();
    expect(screen.getByText('고객센터')).toBeInTheDocument();
  });

  it('로그인/회원가입 텍스트가 존재하는지 확인', () => {
    render(<Header />);
    expect(screen.getByText('로그인')).toBeInTheDocument();
    expect(screen.getByText('회원가입')).toBeInTheDocument();
  });
});
