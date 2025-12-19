import '@testing-library/jest-dom';
import { fireEvent, render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import TopTabs from '../TopTabs';
import type { TopTabItem } from '../types';

describe('TopTabs 유닛 테스트', () => {
  const items = [
    { value: 'tab1', label: 'Tab 1', icon: <span data-testid="icon-1">아이콘</span> },
    { value: 'tab2', label: 'Tab 2' },
    { value: 'tab3', label: 'Tab 3' },
  ] as const satisfies readonly TopTabItem[];

  const renderPanel = (value: string) => <div>{value} Content</div>;

  const getTab = (label: string) => screen.getByRole('tab', { name: new RegExp(label, 'i') });

  it('items가 비어있으면 렌더링되지 않아야 한다', () => {
    const { container } = render(
      <TopTabs items={[]} value="tab1" onChange={() => {}} renderPanel={renderPanel} />
    );
    expect(container.firstChild).toBeNull();
  });

  it('탭 라벨/아이콘이 렌더링되어야 한다', () => {
    render(<TopTabs items={items} value="tab1" onChange={() => {}} renderPanel={renderPanel} />);

    expect(screen.getByText('Tab 1')).toBeInTheDocument();
    expect(screen.getByText('Tab 2')).toBeInTheDocument();
    expect(screen.getByText('Tab 3')).toBeInTheDocument();
    expect(screen.getByTestId('icon-1')).toBeInTheDocument();
  });

  it('탭 클릭 시 onChange가 클릭한 value로 호출되어야 한다', () => {
    const onChange = jest.fn();
    render(<TopTabs items={items} value="tab1" onChange={onChange} renderPanel={renderPanel} />);

    fireEvent.click(getTab('Tab 2'));
    expect(onChange).toHaveBeenCalledWith('tab2');
  });

  it('키보드 Arrow 이동 후 Enter로 선택 시 onChange가 호출되어야 한다', async () => {
    const user = userEvent.setup();
    const onChange = jest.fn();

    render(<TopTabs items={items} value="tab1" onChange={onChange} renderPanel={renderPanel} />);

    getTab('Tab 1').focus();
    await user.keyboard('{ArrowRight}'); // focus -> tab2
    await user.keyboard('{Enter}');

    expect(onChange).toHaveBeenCalledWith('tab2');
  });

  it('키보드 Arrow 이동 후 Space로 선택 시 onChange가 호출되어야 한다', async () => {
    const user = userEvent.setup();
    const onChange = jest.fn();

    render(<TopTabs items={items} value="tab1" onChange={onChange} renderPanel={renderPanel} />);

    getTab('Tab 1').focus();
    await user.keyboard('{ArrowRight}'); // focus -> tab2
    await user.keyboard(' ');

    expect(onChange).toHaveBeenCalledWith('tab2');
  });
});
