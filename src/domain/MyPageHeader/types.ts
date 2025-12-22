import type { LucideIcon } from 'lucide-react';

export interface UserProfile {
  id: string;
  nickname: string;
  profileImageUrl: string;
}

export type BadgeTone = 'blue' | 'green' | 'purple' | 'orange';

export interface MyPageBadge {
  id: string;
  tone: BadgeTone;
  Icon: LucideIcon;
  text: string;
}
