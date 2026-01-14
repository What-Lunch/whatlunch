import { LucideIcon } from 'lucide-react';

export type BadgeVariant = 'blue' | 'green' | 'purple' | 'orange';

export interface BadgeProps {
  id: string;
  variant?: BadgeVariant;
  Icon?: LucideIcon;
  text: string;
}
