export interface PhotoItem {
  id: string;
  url: string;
  caption: string;
  year?: string;
  location?: string;
  aspectRatio?: 'portrait' | 'landscape' | 'square';
}

export interface TimelineItem {
  year: string;
  title: string;
  tagline: string;
  description: string;
  iconName: string;
  color: string;
  badge?: string;
}

export interface WishMessage {
  id: string;
  author: string;
  relation?: string;
  message: string;
  date: string;
  bgColor: string;
  emoji: string;
}

export interface FortyThing {
  id: number;
  title: string;
  subtitle?: string;
  icon: string;
  category?: 'life' | 'party' | 'love' | 'future';
  isCompleted?: boolean;
}

export interface BirthdayConfig {
  personName: string;
  birthDate: string; // e.g. "1986-08-10"
  targetDate: string; // e.g. "2026-08-10"
  tagline: string;
  customSongUrl?: string;
  customSongTitle: string;
  themeColors: {
    primary: string;
    secondary: string;
    accent: string;
    background: string;
  };
  photos: PhotoItem[];
  messages: WishMessage[];
  fortyThings: FortyThing[];
  timeline: TimelineItem[];
}
