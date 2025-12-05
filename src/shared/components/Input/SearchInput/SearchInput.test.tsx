import { render, screen, fireEvent } from '@testing-library/react';
import SearchInput from './SearchInput';

describe('SearchInput Component', () => {
  test('placeholder 기본 렌더링 테스트', () => {
    render(<SearchInput value="" onChange={() => {}} placeholder="search here" />);
    expect(screen.getByPlaceholderText('search here')).toBeInTheDocument();
  });

  test('검색어 입력 시, onChange 정상 호출되는지 테스트', () => {
    const handleChange = jest.fn();
    render(<SearchInput value="" onChange={handleChange} />);

    fireEvent.change(screen.getByRole('textbox'), { target: { value: 'abc' } });

    expect(handleChange).toHaveBeenCalledWith('abc');
  });

  test('clear(x) 아이콘 클릭 시, input 비워지는지 clear 버튼 기능 테스트', () => {
    const handleChange = jest.fn();
    render(<SearchInput value="hello" onChange={handleChange} />);

    const clearBtn = screen.getByLabelText('clear-search');
    fireEvent.click(clearBtn);

    expect(handleChange).toHaveBeenCalledWith('');
  });

  test('Enter로 검색 기능이 트리거 되는지 테스트 ', () => {
    const handleSearch = jest.fn();

    render(
      <SearchInput
        value="test"
        onChange={() => {}}
        onSearch={handleSearch}
      />
    );

    fireEvent.keyDown(screen.getByRole('textbox'), { key: 'Enter' });

    expect(handleSearch).toHaveBeenCalledWith('test');
  });

  test('search 버튼 클릭 시, 검색 실행이 되는지 테스트', () => {
    const handleSearch = jest.fn();

    render(
      <SearchInput
        value="keyword"
        onChange={() => {}}
        onSearch={handleSearch}
      />
    );

    const searchBtn = screen.getByLabelText('search-icon');
    fireEvent.click(searchBtn);

    expect(handleSearch).toHaveBeenCalledWith('keyword');
  });
});
