export interface TastingNote {
  id: string;
  userId: string;
  whiskyId: string;
  rating: number;
  content: string;
  imageUrls: string[] | null;
  createdAt: string;

  whiskies: {
    nameKo: string;
    nameEn: string;
    category?: string;
  } | null;

  nose?: { tags: string[] } | null;
  palate?: { tags: string[] } | null;
  finish?: { tags: string[] } | null;
}
