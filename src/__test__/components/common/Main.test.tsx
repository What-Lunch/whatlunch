import { render, screen } from '@testing-library/react';
import Main from '@/components/common/Main/Main';

describe('<Main />', () => {
  it('renders without crashing', () => {
    render(<Main>hello</Main>);

    const mainElement = screen.getByRole('main');
    expect(mainElement).toBeInTheDocument();
  });

  it('renders children correctly', () => {
    render(<Main>child content</Main>);
    expect(screen.getByText('child content')).toBeInTheDocument();
  });
});
