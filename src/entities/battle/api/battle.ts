import { supabase } from '@/shared/lib/supabase';

import type { Battle, BattleLog, DurationDays } from '../model/types';

export async function findOrCreateBattle(
  userId: string,
  durationDays: DurationDays
): Promise<Battle> {
  // 대기 중인 방 조회
  const { data: waiting, error: fetchError } = await supabase
    .from('battles')
    .select()
    .eq('status', 'waiting')
    .is('user2_id', null)
    .eq('duration_days', durationDays)
    .neq('user1_id', userId)
    .limit(1)
    .single();

  if (fetchError && fetchError.code !== 'PGRST116') {
    throw new Error(fetchError.message);
  }

  if (waiting) {
    // 매칭 성사
    const now = new Date();
    const endsAt = new Date(now);
    endsAt.setDate(endsAt.getDate() + durationDays);

    const { data, error } = await supabase
      .from('battles')
      .update({
        user2_id: userId,
        status: 'active',
        started_at: now.toISOString(),
        ends_at: endsAt.toISOString(),
      })
      .eq('id', waiting.id)
      .select()
      .single();

    if (error) throw new Error(error.message);
    return data;
  }

  // 대기방 생성
  const { data, error } = await supabase
    .from('battles')
    .insert({ user1_id: userId, duration_days: durationDays })
    .select()
    .single();

  if (error) throw new Error(error.message);
  return data;
}

export async function getBattleById(id: string): Promise<Battle> {
  const { data, error } = await supabase
    .from('battles')
    .select()
    .eq('id', id)
    .single();

  if (error) throw new Error(error.message);
  return data;
}

export async function getBattleLogs(battleId: string): Promise<BattleLog[]> {
  const { data, error } = await supabase
    .from('battle_logs')
    .select()
    .eq('battle_id', battleId)
    .order('recorded_at', { ascending: false });

  if (error) throw new Error(error.message);
  return data;
}

export async function recordKm(
  battleId: string,
  userId: string,
  km: number
): Promise<BattleLog> {
  const { data, error } = await supabase
    .from('battle_logs')
    .insert({ battle_id: battleId, user_id: userId, km })
    .select()
    .single();

  if (error) throw new Error(error.message);
  return data;
}

export async function finalizeBattle(battleId: string): Promise<void> {
  const { error } = await supabase.rpc('finalize_battle', {
    p_battle_id: battleId,
  });
  if (error) throw new Error(error.message);
}

export async function getBattleWithUsers(id: string): Promise<{
  battle: Battle;
  user1Nickname: string;
  user2Nickname: string | null;
}> {
  const { data, error } = await supabase
    .from('battles')
    .select(`
      *,
      user1:users!battles_user1_id_fkey(nickname),
      user2:users!battles_user2_id_fkey(nickname)
    `)
    .eq('id', id)
    .single();

  if (error) throw new Error(error.message);

  return {
    battle: data,
    user1Nickname: (data.user1 as { nickname: string })?.nickname ?? '???',
    user2Nickname: (data.user2 as { nickname: string } | null)?.nickname ?? null,
  };
}
