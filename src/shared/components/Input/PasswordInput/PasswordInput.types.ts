import { BaseInputProps } from '../BaseInput/BaseInput.types';

export type PasswordInputProps = Omit<
  BaseInputProps,
  | 'type' | 'children'
> & {
  showToggle?: boolean;
}