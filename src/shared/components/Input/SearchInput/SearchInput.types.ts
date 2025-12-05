import { InputHTMLAttributes, ReactNode } from "react";

export interface SearchInputProps extends Omit<InputHTMLAttributes<HTMLInputElement>, 'type' | 'onChange'> {
    value: string;
    onChange: (value: string) => void;

    onSearch?: (value: string) => void;

    searchIcon?: ReactNode;
    clearIcon?: ReactNode;

    disabled?: boolean;
}