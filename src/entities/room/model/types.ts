export type RoomStatus = 'waiting' | 'active' | 'finished';

export interface Room {
  id: string;
  owner_id: string;
  title: string;
  goal_km: number | null;
  duration_minutes: number;
  invite_code: string;
  status: RoomStatus;
  started_at: string | null;
  ends_at: string | null;
  created_at: string;
}
