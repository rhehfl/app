import AsyncStorage from '@react-native-async-storage/async-storage';

import { TASTING_NOTES_STORAGE_KEY } from '@/entities/tasting-note/constants/tastingNoteKey';
import type { TastingNote } from '@/entities/tasting-note/model/tastingNote';

export async function addTastingNote(newNote: TastingNote): Promise<void> {
  try {
    const jsonValue = await AsyncStorage.getItem(TASTING_NOTES_STORAGE_KEY);
    const existingNotes: TastingNote[] =
      jsonValue != null ? JSON.parse(jsonValue) : [];

    const updatedNotes = [newNote, ...existingNotes];

    await AsyncStorage.setItem(
      TASTING_NOTES_STORAGE_KEY,
      JSON.stringify(updatedNotes),
    );
  } catch (error) {
    console.error('데이터를 저장하는 중 에러 발생:', error);
    throw error;
  }
}
