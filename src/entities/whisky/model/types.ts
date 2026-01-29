export type WhiskyType =
  | 'Single Malt'
  | 'Bourbon'
  | 'Blended'
  | 'Rye'
  | 'Other';

export interface Whisky {
  id: string;
  name: string;
  brand?: string;
  type: WhiskyType;
  country?: string;
  abv?: number;
  age?: number;
  imageUrl?: string;
  price?: number;
}
