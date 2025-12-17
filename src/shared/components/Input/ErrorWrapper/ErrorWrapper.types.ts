import { ReactNode } from 'react';

export interface ErrorWrapperProps {
  isError?: boolean;
  errorMessage?: string;
  children: ReactNode; // BaseInput이나 PasswordInput을 받음
}