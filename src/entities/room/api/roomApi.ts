import { supabase } from '@/shared/lib/supabase';

import type { Room } from '../model/types';

export interface CreateRoomInput {
  owner_id: string;
  title: string;
  goal_km: number | null;
  duration_minutes: number;
  invite_code: string;
}

export async function createRoom(input: CreateRoomInput): Promise<Room> {
  const { data, error } = await supabase
    .from('rooms')
    .insert(input)
    .select()
    .single();
  if (error) throw error;
  return data;
}

export async function getRoomById(id: string): Promise<Room> {
  const { data, error } = await supabase
    .from('rooms')
    .select('*')
    .eq('id', id)
    .single();
  if (error) throw error;
  return data;
}

export async function getRoomByInviteCode(code: string): Promise<Room> {
  const { data, error } = await supabase
    .from('rooms')
    .select('*')
    .eq('invite_code', code.toUpperCase())
    .single();
  if (error) throw error;
  return data;
}

export async function startRoom(id: string, durationMinutes: number): Promise<void> {
  const endsAt = new Date(Date.now() + durationMinutes * 60 * 1000).toISOString();
  const { error } = await supabase
    .from('rooms')
    .update({
      status: 'active',
      started_at: new Date().toISOString(),
      ends_at: endsAt,
    })
    .eq('id', id);
  if (error) throw error;
}

export async function finishRoom(id: string): Promise<void> {
  const { error } = await supabase
    .from('rooms')
    .update({ status: 'finished' })
    .eq('id', id);
  if (error) throw error;
}
