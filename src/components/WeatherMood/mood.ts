export const moodIds = ['happy', 'normal', 'sad', 'angry', 'tired'] as const;

export type MoodId = (typeof moodIds)[number];

export interface MoodOption {
  id: MoodId;
  label: string;
  icon: string;
}
