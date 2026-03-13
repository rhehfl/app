export interface Participant {
  id: string;
  room_id: string;
  user_id: string;
  total_km: number;
  rank: number | null;
  joined_at: string;
  users?: { nickname: string };
}

export interface RideLog {
  id: string;
  room_id: string;
  user_id: string;
  km: number;
  started_at: string | null;
  ended_at: string | null;
}
