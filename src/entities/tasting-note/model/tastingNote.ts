export interface TastingNote {
  id: string;
  name: string;
  date: string;
  content: string;
  imageUri: string | null;
  nose: { memo: string | null } | null;
  palate: { memo: string | null } | null;
  finish: { memo: string | null } | null;
}
