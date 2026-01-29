import type { Whisky } from '@/entities/whisky';

export interface TastingNote {
  id: string;
  userId: string;
  whiskyId: string;
  whisky: Whisky;

  rating: number;
  content: string;

  tags?: string[];

  images?: string[];
  createdAt: string;
}
