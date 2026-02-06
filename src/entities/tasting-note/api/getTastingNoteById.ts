import AsyncStorage from '@react-native-async-storage/async-storage';

import { TASTING_NOTES_STORAGE_KEY } from '@/entities/tasting-note/constants/tastingNoteKey';
import type { TastingNote } from '@/entities/tasting-note/model/tastingNote';

export async function getTastingNoteById(
  id: string,
): Promise<TastingNote | null> {
  try {
    const jsonValue = await AsyncStorage.getItem(TASTING_NOTES_STORAGE_KEY);

    if (!jsonValue) {
      return null;
    }

    const notes: TastingNote[] = JSON.parse(jsonValue);
    return notes.find((note) => note.id === id) ?? null;
  } catch (error) {
    console.error('단일 노트를 불러오는 중 에러 발생:', error);
    return null;
  }
}
