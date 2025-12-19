import { render, screen, fireEvent, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import '@testing-library/jest-dom';

import TopTabs from '../TopTabs';
import type { TopTabItem } from '../types';

describe('TopTabs Component', () => {
  const mockItems = [
    { value: 'tab1', label: 'Tab 1', icon: <span data-testid="icon-1">테스트</span> },
    { value: 'tab2', label: 'Tab 2' },
    { value: 'tab3', label: 'Tab 3' },
  ] as const satisfies readonly TopTabItem[];

  type TabValue = (typeof mockItems)[number]['value'];

  const mockRenderPanel = (value: string) => <div data-testid="panel-content">{value} Content</div>;

  const getDefaultProps = (override?: Partial<React.ComponentProps<typeof TopTabs>>) => {
    const onChange = jest.fn();
    return {
      items: mockItems,
      value: 'tab1' as TabValue,
      onChange,
      renderPanel: mockRenderPanel,
      ...override,
    };
  };

  const getTabButtonByLabel = (label: string) =>
    screen.getByRole('button', { name: new RegExp(label, 'i') });

  const getPanelElements = (): HTMLElement[] => {
    const contents = screen.getAllByTestId('panel-content');
    return contents
      .map(node => node.closest('.top-tabs__panel'))
      .filter((el): el is HTMLElement => el !== null);
  };

  const getVisiblePanel = (): HTMLElement => {
    const panels = getPanelElements();
    const visible = panels.find(panel => !panel.classList.contains('top-tabs__panel--hidden'));
    if (!visible) throw new Error('No visible panel found');
    return visible;
  };

  describe('1. 렌더링 테스트', () => {
    it('모든 탭 라벨이 화면에 렌더링되어야 한다', () => {
      render(<TopTabs {...getDefaultProps()} />);
      mockItems.forEach(item => {
        expect(screen.getByText(item.label)).toBeInTheDocument();
      });
    });

    it('아이콘이 있는 아이템은 아이콘을 표시해야 한다', () => {
      render(<TopTabs {...getDefaultProps()} />);
      expect(screen.getByTestId('icon-1')).toBeInTheDocument();
    });

    it('초기 value로 전달된 탭이 활성화 클래스/탭인덱스를 가져야 한다', () => {
      render(<TopTabs {...getDefaultProps({ value: 'tab1' })} />);
      const tab1 = getTabButtonByLabel('Tab 1');

      expect(tab1).toHaveClass('top-tabs__tab--active');
      expect(tab1).toHaveAttribute('tabindex', '0');
    });

    it('items가 비어있으면 컴포넌트가 렌더링되지 않아야 한다', () => {
      const { container } = render(<TopTabs {...getDefaultProps({ items: [] })} />);
      expect(container.firstChild).toBeNull();
    });
  });

  describe('2. User Interactions', () => {
    it('탭 클릭 시 onChange 함수가 클릭한 value와 함께 호출되어야 한다', () => {
      const props = getDefaultProps();
      render(<TopTabs {...props} />);

      const tab2 = getTabButtonByLabel('Tab 2');
      fireEvent.click(tab2);

      expect(props.onChange).toHaveBeenCalledWith('tab2');
    });

    it('value가 items에 없으면 첫 번째 탭이 활성화되어야 한다', () => {
      render(<TopTabs {...getDefaultProps({ value: 'invalid' as string })} />);

      const tab1 = getTabButtonByLabel('Tab 1');
      expect(tab1).toHaveClass('top-tabs__tab--active');
    });

    it('활성화된 탭에 맞는 패널 콘텐츠가 화면에 나타나야 한다', () => {
      render(<TopTabs {...getDefaultProps({ value: 'tab2' })} />);

      const visiblePanel = getVisiblePanel();
      expect(within(visiblePanel).getByTestId('panel-content')).toHaveTextContent('tab2 Content');
    });

    it('활성화되지 않은 패널은 hidden 클래스가 적용되어야 한다', () => {
      render(<TopTabs {...getDefaultProps({ value: 'tab2' })} />);

      const panels = getPanelElements();

      expect(panels[1]).not.toHaveClass('top-tabs__panel--hidden');
      expect(panels[0]).toHaveClass('top-tabs__panel--hidden');
      expect(panels[2]).toHaveClass('top-tabs__panel--hidden');
    });
  });

  describe('3. 키보드 내비게이션 테스트', () => {
    it('활성 탭은 tabIndex="0"을 가져야 한다', () => {
      render(<TopTabs {...getDefaultProps({ value: 'tab1' })} />);
      const tab1 = getTabButtonByLabel('Tab 1');
      expect(tab1).toHaveAttribute('tabindex', '0');
    });

    it('비활성 탭은 tabIndex="-1"을 가져야 한다', () => {
      render(<TopTabs {...getDefaultProps({ value: 'tab1' })} />);
      const tab2 = getTabButtonByLabel('Tab 2');
      expect(tab2).toHaveAttribute('tabindex', '-1');
    });

    it('Tab 키로 접근했을 때 활성 탭에 포커스가 가야 한다', async () => {
      const user = userEvent.setup();
      render(<TopTabs {...getDefaultProps({ value: 'tab1' })} />);

      await user.tab();
      expect(getTabButtonByLabel('Tab 1')).toHaveFocus();
    });

    it('ArrowRight를 누르면 다음 탭으로 포커스가 이동해야 한다', async () => {
      const user = userEvent.setup();
      render(<TopTabs {...getDefaultProps({ value: 'tab1' })} />);

      const tab1 = getTabButtonByLabel('Tab 1');
      const tab2 = getTabButtonByLabel('Tab 2');

      tab1.focus();
      expect(tab1).toHaveFocus();

      await user.keyboard('{ArrowRight}');
      expect(tab2).toHaveFocus();
    });

    it('ArrowLeft를 누르면 이전 탭으로 포커스가 이동해야 한다', async () => {
      const user = userEvent.setup();
      render(<TopTabs {...getDefaultProps({ value: 'tab2' })} />);

      const tab2 = getTabButtonByLabel('Tab 2');
      const tab1 = getTabButtonByLabel('Tab 1');

      tab2.focus();
      expect(tab2).toHaveFocus();

      await user.keyboard('{ArrowLeft}');
      expect(tab1).toHaveFocus();
    });
  });
});
