import { render, screen, fireEvent } from '@testing-library/react';
import MapPanel from '../MapPanel';
import { CATEGORIES } from '../type';

describe('MapPanel UI', () => {
  test('검색어 입력 시 setKeyword가 호출된다', () => {
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

  test('Enter 키 입력 시 onKeywordSearch 호출', () => {
    const onKeywordSearch = jest.fn();

    render(
      <MapPanel
        keyword="파스타"
        setKeyword={() => {}}
        onKeywordSearch={onKeywordSearch}
        onCategoryClick={() => {}}
        onReset={() => {}}
      />
    );

    fireEvent.keyDown(screen.getByPlaceholderText(/검색/), {
      key: 'Enter',
    });

    expect(onKeywordSearch).toHaveBeenCalled();
  });

  test('검색 버튼 클릭 시 onKeywordSearch 호출', () => {
    const onKeywordSearch = jest.fn();

    render(
      <MapPanel
        keyword="커피"
        setKeyword={() => {}}
        onKeywordSearch={onKeywordSearch}
        onCategoryClick={() => {}}
        onReset={() => {}}
      />
    );

    fireEvent.click(screen.getByRole('button', { name: /검색/ }));

    expect(onKeywordSearch).toHaveBeenCalled();
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

  test('카테고리 클릭 시 onCategoryClick 호출', () => {
    const onCategoryClick = jest.fn();

    render(
      <MapPanel
        keyword=""
        setKeyword={() => {}}
        onKeywordSearch={() => {}}
        onCategoryClick={onCategoryClick}
        onReset={() => {}}
      />
    );

    fireEvent.click(screen.getByText(CATEGORIES[0].label));

    expect(onCategoryClick).toHaveBeenCalledWith(CATEGORIES[0].code);
  });

  test('초기화 버튼 클릭 시 onReset 호출', () => {
    const onReset = jest.fn();

    render(
      <MapPanel
        keyword=""
        setKeyword={() => {}}
        onKeywordSearch={() => {}}
        onCategoryClick={() => {}}
        onReset={onReset}
      />
    );

    fireEvent.click(screen.getByText('초기화'));

    expect(onReset).toHaveBeenCalled();
  });
});
