import { BaseInputProps } from '../BaseInput/types';

export type PasswordInputProps = Omit<BaseInputProps, 'type' | 'children'> & {
  showToggle?: boolean;
};
