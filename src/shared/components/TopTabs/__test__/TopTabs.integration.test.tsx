import type { ComponentProps, ReactNode } from 'react';

import { useState } from 'react';

import '@testing-library/jest-dom';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import TopTabs from '../TopTabs';
import type { TopTabItem } from '../types';

describe('TopTabs 통합 테스트)', () => {
  const items = [
    { value: 'tab1', label: 'Tab 1', icon: <span data-testid="icon-1">아이콘</span> },
    { value: 'tab2', label: 'Tab 2' },
    { value: 'tab3', label: 'Tab 3' },
  ] as const satisfies readonly TopTabItem[];

  type TabValue = (typeof items)[number]['value'];

  const renderPanel = (value: string): ReactNode => (
    <div data-testid={`panel-${value}`}>{value} Content</div>
  );

  const getTab = (label: string) => screen.getByRole('tab', { name: new RegExp(label, 'i') });

  const getPanels = () => screen.queryAllByRole('tabpanel', { hidden: true });

  function ControlledTabs(
    props: Partial<ComponentProps<typeof TopTabs>> & { initialValue?: TabValue | string }
  ) {
    const { initialValue = 'tab1', ...rest } = props;
    const [value, setValue] = useState<string>(initialValue);

    return (
      <TopTabs
        items={items}
        value={value}
        onChange={setValue}
        renderPanel={renderPanel}
        {...rest}
      />
    );
  }

  it('lazyMount=false 기본 동작: 모든 패널이 DOM에 있고 hidden으로 전환된다', async () => {
    const user = userEvent.setup();
    render(<ControlledTabs initialValue="tab1" />);

    const tab1Panel = screen.getByTestId('panel-tab1').closest('[role="tabpanel"]');
    const tab2Panel = screen.getByTestId('panel-tab2').closest('[role="tabpanel"]');

    expect(tab1Panel).not.toHaveAttribute('hidden');
    expect(tab2Panel).toHaveAttribute('hidden');

    await user.click(getTab('Tab 2'));

    const tab1PanelAfter = screen.getByTestId('panel-tab1').closest('[role="tabpanel"]');
    const tab2PanelAfter = screen.getByTestId('panel-tab2').closest('[role="tabpanel"]');

    expect(tab1PanelAfter).toHaveAttribute('hidden');
    expect(tab2PanelAfter).not.toHaveAttribute('hidden');
  });

  it('lazyMount=true: 초기에는 활성 패널만 DOM에 존재해야 한다', () => {
    render(<ControlledTabs initialValue="tab1" lazyMount />);

    expect(screen.getByTestId('panel-tab1')).toBeInTheDocument();
    expect(screen.queryByTestId('panel-tab2')).not.toBeInTheDocument();
    expect(screen.queryByTestId('panel-tab3')).not.toBeInTheDocument();

    expect(getPanels()).toHaveLength(1);
  });

  it('lazyMount=true: 방문한 탭 패널은 DOM에 유지되고 hidden으로 토글되어야 한다', async () => {
    const user = userEvent.setup();
    render(<ControlledTabs initialValue="tab1" lazyMount />);

    // tab1만 존재 확인
    await waitFor(() => {
      expect(getPanels()).toHaveLength(1);
      expect(screen.getByTestId('panel-tab1')).toBeInTheDocument();
    });

    // tab2 방문 -> tab1+tab2 2개 존재
    await user.click(getTab('Tab 2'));

    await waitFor(() => {
      expect(screen.getByTestId('panel-tab2')).toBeInTheDocument();
      expect(getPanels()).toHaveLength(2);
    });

    // tab1으로 복귀 -> tab2는 hidden, DOM은 유지
    await user.click(getTab('Tab 1'));

    const tab1Panel = screen.getByTestId('panel-tab1').closest('[role="tabpanel"]');
    const tab2Panel = screen.getByTestId('panel-tab2').closest('[role="tabpanel"]');

    expect(tab1Panel).not.toHaveAttribute('hidden');
    expect(tab2Panel).toHaveAttribute('hidden');
  });

  it('lazyMount=true: 방문하지 않은 탭 패널은 DOM에 없어야 한다', async () => {
    const user = userEvent.setup();
    render(<ControlledTabs initialValue="tab1" lazyMount />);

    await user.click(getTab('Tab 2'));

    await waitFor(() => {
      expect(screen.getByTestId('panel-tab2')).toBeInTheDocument();
    });

    expect(screen.queryByTestId('panel-tab3')).not.toBeInTheDocument();
  });
});
