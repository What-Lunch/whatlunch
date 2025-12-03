import { render, screen, fireEvent } from '@testing-library/react';
import MapPanel from '../MapPanel';
import { CATEGORIES } from '../type';

describe('MapPanel UI (컴포넌트 단위)', () => {
  test('검색어 입력 시 setKeyword 호출된다', () => {
    const setKeyword = jest.fn();

    render(
      <MapPanel
        keyword=""
        setKeyword={setKeyword}
        onKeywordSearch={() => {}}
        onCategoryClick={() => {}}
        onReset={() => {}}
      />
    );

    fireEvent.change(screen.getByPlaceholderText(/검색/), {
      target: { value: '라멘' },
    });

    expect(setKeyword).toHaveBeenCalledWith('라멘');
  });

  test('카테고리 버튼이 모두 렌더링된다', () => {
    render(
      <MapPanel
        keyword=""
        setKeyword={() => {}}
        onKeywordSearch={() => {}}
        onCategoryClick={() => {}}
        onReset={() => {}}
      />
    );

    CATEGORIES.forEach(cat => {
      expect(screen.getByText(cat.label)).toBeInTheDocument();
    });
  });

  test('검색어 value가 input에 반영된다', () => {
    render(
      <MapPanel
        keyword="초기값"
        setKeyword={() => {}}
        onKeywordSearch={() => {}}
        onCategoryClick={() => {}}
        onReset={() => {}}
      />
    );

    expect(screen.getByPlaceholderText(/검색/)).toHaveValue('초기값');
  });
});
