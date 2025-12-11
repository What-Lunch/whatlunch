import { BaseInputProps } from '../BaseInput/BaseInput.types';

export interface FormFieldProps extends BaseInputProps {
  isError?: boolean;
  errorMessage?: string;
  showToggle?: boolean;
}