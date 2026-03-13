import AsyncStorage from '@react-native-async-storage/async-storage';

import { generateNickname } from './nickname';

const USER_STORAGE_KEY = '@bikebattle/user';

function generateUUID(): string {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
    const r = (Math.random() * 16) | 0;
    const v = c === 'x' ? r : (r & 0x3) | 0x8;
    return v.toString(16);
  });
}

export interface LocalUser {
  id: string;
  nickname: string;
}

export async function getLocalUser(): Promise<LocalUser> {
  try {
    const stored = await AsyncStorage.getItem(USER_STORAGE_KEY);
    if (stored) {
      return JSON.parse(stored) as LocalUser;
    }
  } catch {
    // ignore parse errors
  }

  const user: LocalUser = {
    id: generateUUID(),
    nickname: generateNickname(),
  };

  await AsyncStorage.setItem(USER_STORAGE_KEY, JSON.stringify(user));
  return user;
}
