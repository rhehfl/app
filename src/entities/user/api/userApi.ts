import { supabase } from '@/shared/lib/supabase';

import type { User } from '../model/types';

export async function getOrCreateUser(id: string, nickname: string): Promise<User> {
  const { data, error } = await supabase
    .from('users')
    .upsert({ id, nickname }, { onConflict: 'id' })
    .select()
    .single();
  if (error) throw error;
  return data;
}

export async function getUser(id: string): Promise<User | null> {
  const { data, error } = await supabase
    .from('users')
    .select('*')
    .eq('id', id)
    .single();
  if (error) return null;
  return data;
}
