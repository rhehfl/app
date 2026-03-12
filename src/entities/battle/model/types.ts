export type BattleStatus = 'waiting' | 'active' | 'finished';
export type DurationDays = 1 | 3 | 7;

export type Battle = {
  id: string;
  user1_id: string;
  user2_id: string | null;
  duration_days: DurationDays;
  status: BattleStatus;
  winner_id: string | null;
  started_at: string | null;
  ends_at: string | null;
  created_at: string;
};

export type BattleLog = {
  id: string;
  battle_id: string;
  user_id: string;
  km: number;
  recorded_at: string;
};
