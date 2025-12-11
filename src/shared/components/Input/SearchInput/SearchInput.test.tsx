import React, { useState } from 'react';
import { render, screen, fireEvent } from '@testing-library/react';

import SearchInput from './SearchInput';

interface SearchInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
    value: string;
    onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
    onSearch: (value: string) => void;
    searchIcon?: React.ReactNode;
    clearIcon?: React.ReactNode;
} 

interface ControlledSearchInputWrapperProps extends Omit<SearchInputProps, 'value' | 'onChange'> {
    initialValue?: string;
    mockOnChange?: (e: React.ChangeEvent<HTMLInputElement>) => void; 
}

const ControlledSearchInputWrapper: React.FC<ControlledSearchInputWrapperProps> = ({ 
    initialValue = '', 
    mockOnChange, 
    ...rest
}) => {
    const [currentValue, setCurrentValue] = useState(initialValue);
    
    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setCurrentValue(e.target.value);
        if (mockOnChange) mockOnChange(e); 
    };
    
    return (
        <SearchInput
            {...rest as SearchInputProps} 
            value={currentValue}
            onChange={handleChange}
        />
    );
};

describe('SearchInput Component', () => {
    const mockOnSearch = jest.fn(); 
    const mockOnChange = jest.fn();

    test('placeholder 기본 렌더링 테스트', () => {
        render(
            <SearchInput 
                value="" 
                onChange={mockOnChange} 
                onSearch={mockOnSearch} 
                placeholder="search here" 
            />
        );
        expect(screen.getByPlaceholderText('search here')).toBeInTheDocument();
    });
    test('검색어 입력 시, Input의 value가 새 값으로 올바르게 업데이트되는지 테스트', () => {
        const testValue = 'abc';    
        render(
            <ControlledSearchInputWrapper 
                onSearch={mockOnSearch} 
                placeholder="controlled search input"
            />
        );

        const input = screen.getByPlaceholderText('controlled search input');
        fireEvent.change(input, { target: { value: testValue } });

        expect(input).toHaveValue(testValue);
    });

    test('clear(x) 아이콘 클릭 시, input 비워지는 ChangeEvent가 호출되는지 테스트', () => {
        mockOnChange.mockClear(); 
        
        render(
            <SearchInput 
                value="hello" 
                onChange={mockOnChange} 
                onSearch={mockOnSearch} 
            />
        );

        const clearBtn = screen.getByLabelText('clear-search');
        fireEvent.click(clearBtn);

        expect(mockOnChange).toHaveBeenCalledTimes(1);
        const event = mockOnChange.mock.calls[0][0] as React.ChangeEvent<HTMLInputElement>;
        expect(event.target.value).toBe('');
    });

    test('Enter로 검색 기능이 트리거 되는지 테스트 ', () => {
        mockOnSearch.mockClear();
        const testKeyword = "test_keyword";

        render(
            <SearchInput
                value={testKeyword}
                onChange={mockOnChange}
                onSearch={mockOnSearch}
            />
        );

        fireEvent.keyDown(screen.getByRole('textbox'), { key: 'Enter' });

        expect(mockOnSearch).toHaveBeenCalledWith(testKeyword);
    });

    test('search 버튼 클릭 시, 검색 실행이 되는지 테스트', () => {
        mockOnSearch.mockClear();
        const clickKeyword = "click_keyword";

        render(
            <SearchInput
                value={clickKeyword}
                onChange={mockOnChange}
                onSearch={mockOnSearch}
            />
        );

        const searchBtn = screen.getByLabelText('search-icon');
        fireEvent.click(searchBtn);

        expect(mockOnSearch).toHaveBeenCalledWith(clickKeyword);
    });

    test('disabled 상태일 때 모든 동작이 비활성화되는지 테스트', () => {
        mockOnSearch.mockClear();

        render(
            <SearchInput
                value="test"
                onChange={mockOnChange}
                onSearch={mockOnSearch}
                disabled
            />
        );

        const input = screen.getByRole('textbox');
        expect(input).toBeDisabled(); 

        const searchBtn = screen.getByLabelText('search-icon');
        
        expect(screen.queryByLabelText('clear-search')).not.toBeInTheDocument(); 

        fireEvent.keyDown(input, { key: 'Enter' });
        expect(mockOnSearch).not.toHaveBeenCalled();
        
        fireEvent.click(searchBtn);
        expect(mockOnSearch).not.toHaveBeenCalled();
    });
});