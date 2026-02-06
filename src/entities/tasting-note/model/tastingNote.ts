export interface TastingNote {
  id: string;
  content: string;
  imageUrls: string[] | null;
  nose: { memo: string | null } | null;
  palate: { memo: string | null } | null;
  finish: { memo: string | null } | null;
}
