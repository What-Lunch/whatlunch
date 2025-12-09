import { InputHTMLAttributes } from 'react';

export interface FormInputProps extends Omit<InputHTMLAttributes<HTMLInputElement>, 'type' | 'onChange'> {
    type: 'email' | 'password';

    value: string;
    onChange: (value: string) => void;

    isError?: boolean;
    errorMessage?: string;
    
    showToggle?: boolean;
    
    disabled?: boolean;
}