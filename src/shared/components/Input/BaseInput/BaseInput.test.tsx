import React, { useState } from 'react';
import { render, screen, fireEvent } from '@testing-library/react';

import BaseInput from './BaseInput';
import { BaseInputProps } from './BaseInput.types';

// 제어 컴포넌트 테스트용 래퍼
interface ControlledTestWrapperProps extends Omit<BaseInputProps, 'value' | 'onChange'> {
  initialValue?: string;
  mockOnChange?: (e: React.ChangeEvent<HTMLInputElement>) => void; 
}

const ControlledTestWrapper: React.FC<ControlledTestWrapperProps> = ({ 
  initialValue = '', 
  wrapperClassName = 'test-wrapper',
  mockOnChange,
  ...rest
}) => {
  const [currentValue, setCurrentValue] = useState(initialValue);
  
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setCurrentValue(e.target.value);
    if (mockOnChange) mockOnChange(e); 
  };
  
  return (
    <BaseInput
      {...rest}
      value={currentValue}
      onChange={handleChange}
      wrapperClassName={wrapperClassName}
    />
  );
};

// Props 전달용 wrapper
const TestInput = (props: BaseInputProps) => (
  <BaseInput 
    {...props} 
    wrapperClassName={`${props.wrapperClassName || ''} test-wrapper`} 
  />
);


describe('BaseInput Component', () => {
	test('사용자가 입력 시 input의 value가 올바르게 업데이트되는지 테스트 (Controlled)', () => {
    render(<ControlledTestWrapper type="text" placeholder="controlled test" />);
    
    const input = screen.getByPlaceholderText('controlled test');
    const newValue = 'hello world';
    
		fireEvent.change(input, { target: { value: newValue } });

    expect(input).toHaveValue(newValue);
  });
    
  test('onChange prop이 ChangeEvent를 받아 정확히 호출되는지 테스트', () => {
    const mockPropOnChange = jest.fn();
    const testValue = 'event check';

    render(
        <ControlledTestWrapper 
            type="text" 
            mockOnChange={mockPropOnChange} 
            placeholder="event-check-input"
        />
    );
    
    const input = screen.getByPlaceholderText('event-check-input');

    fireEvent.change(input, { target: { value: testValue } });
		
		expect(mockPropOnChange).toHaveBeenCalledTimes(1);
		
		const event = mockPropOnChange.mock.calls[0][0] as React.ChangeEvent<HTMLInputElement>;
    expect(event.target.value).toBe(testValue); 
  });
  
	test('disabled prop이 input에 정확히 적용되는지 테스트', () => {
    render(<TestInput type="text" value="" onChange={() => {}} disabled />);
    expect(screen.getByRole('textbox')).toBeDisabled();
  });
  
  test('input focus/blur 시 wrapper에 focused 클래스가 적용되는지 테스트', () => {
    render(<TestInput type="text" value="" onChange={() => {}} />);
    const wrapper = screen.getByRole('textbox').closest('.test-wrapper');
    const input = screen.getByRole('textbox');

    // 초기 상태
    expect(wrapper).not.toHaveClass('focused');

    // focus 시
    fireEvent.focus(input);
    expect(wrapper).toHaveClass('focused');

    // blur 시
    fireEvent.blur(input);
    expect(wrapper).not.toHaveClass('focused');
  });
});