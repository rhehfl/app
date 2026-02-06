import AsyncStorage from '@react-native-async-storage/async-storage';

import { TASTING_NOTES_STORAGE_KEY } from '@/entities/tasting-note/constants/tastingNoteKey';
import type { TastingNote } from '@/entities/tasting-note/model/tastingNote';

export async function getTastingNotes(): Promise<TastingNote[]> {
  try {
    const jsonValue = await AsyncStorage.getItem(TASTING_NOTES_STORAGE_KEY);

    return jsonValue != null ? JSON.parse(jsonValue) : [];
  } catch (error) {
    console.error('로컬 데이터를 불러오는 중 에러 발생:', error);
    return [];
  }
}
