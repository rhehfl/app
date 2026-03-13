import { supabase } from '@/shared/lib/supabase';

import type { Participant } from '../model/types';

export async function joinRoom(roomId: string, userId: string): Promise<Participant> {
  const { data, error } = await supabase
    .from('participants')
    .upsert({ room_id: roomId, user_id: userId }, { onConflict: 'room_id,user_id' })
    .select('*, users(nickname)')
    .single();
  if (error) throw error;
  return data;
}

export async function getParticipants(roomId: string): Promise<Participant[]> {
  const { data, error } = await supabase
    .from('participants')
    .select('*, users(nickname)')
    .eq('room_id', roomId)
    .order('total_km', { ascending: false });
  if (error) throw error;
  return data ?? [];
}

export async function logRide(
  roomId: string,
  userId: string,
  km: number,
  startedAt: string,
  endedAt: string
): Promise<void> {
  const { error: logError } = await supabase.from('ride_logs').insert({
    room_id: roomId,
    user_id: userId,
    km,
    started_at: startedAt,
    ended_at: endedAt,
  });
  if (logError) throw logError;

  const { data: current, error: fetchError } = await supabase
    .from('participants')
    .select('total_km')
    .eq('room_id', roomId)
    .eq('user_id', userId)
    .single();
  if (fetchError) throw fetchError;

  const { error: updateError } = await supabase
    .from('participants')
    .update({ total_km: (current?.total_km ?? 0) + km })
    .eq('room_id', roomId)
    .eq('user_id', userId);
  if (updateError) throw updateError;
}

export async function finalizeRanks(roomId: string): Promise<void> {
  const { data, error } = await supabase
    .from('participants')
    .select('id, total_km')
    .eq('room_id', roomId)
    .order('total_km', { ascending: false });
  if (error) throw error;

  await Promise.all(
    (data ?? []).map((p, i) =>
      supabase.from('participants').update({ rank: i + 1 }).eq('id', p.id)
    )
  );
}
