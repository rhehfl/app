import { supabase } from '@/shared/lib/supabase';
import { generateNickname } from '../lib/generateNickname';
import type { User } from '../model/types';

export async function createAnonymousUser(): Promise<User> {
  const nickname = generateNickname();

  const { data, error } = await supabase
    .from('users')
    .insert({ nickname })
    .select()
    .single();

  if (error) throw new Error(error.message);
  return data;
}

export async function getUserById(id: string): Promise<User> {
  const { data, error } = await supabase
    .from('users')
    .select()
    .eq('id', id)
    .single();

  if (error) throw new Error(error.message);
  return data;
}
