import type { TastingNote } from '@/entities/tasting-note/model/types';

import { supabase } from '@/shared/lib/supabase';

export async function getTastingNotes(): Promise<TastingNote[]> {
  const { data, error } = await supabase
    .from('tasting_notes')
    .select(
      `
      id,
      userId: user_id,        
      whiskyId: whisky_id,
      rating,
      content,
      imageUrls: image_urls,
      createdAt: created_at,
      nose,
      palate,
      finish,
      whiskies (
        nameKo: name_ko,      
        nameEn: name_en,
        category
      )
    `,
    )
    .order('created_at', { ascending: false })
    .returns<TastingNote[]>();

  if (error) {
    console.error('Error fetching notes:', error);
    return [];
  }

  return data || [];
}
