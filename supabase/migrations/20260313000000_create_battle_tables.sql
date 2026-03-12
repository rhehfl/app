-- 유저 (익명)
create table if not exists users (
  id uuid primary key default gen_random_uuid(),
  nickname text not null,
  created_at timestamptz default now()
);

-- 대결
create table if not exists battles (
  id uuid primary key default gen_random_uuid(),
  user1_id uuid references users(id),
  user2_id uuid references users(id),
  duration_days int not null default 7,
  status text not null default 'waiting',
  winner_id uuid references users(id),
  started_at timestamptz,
  ends_at timestamptz,
  created_at timestamptz default now(),
  constraint battles_status_check check (status in ('waiting', 'active', 'finished')),
  constraint battles_duration_check check (duration_days in (1, 3, 7))
);

-- km 기록
create table if not exists battle_logs (
  id uuid primary key default gen_random_uuid(),
  battle_id uuid references battles(id) on delete cascade,
  user_id uuid references users(id),
  km numeric not null check (km >= 0),
  recorded_at timestamptz default now()
);

-- RLS 활성화
alter table users enable row level security;
alter table battles enable row level security;
alter table battle_logs enable row level security;

-- RLS 정책: 모두 읽기 가능
create policy "users_select" on users for select using (true);
create policy "battles_select" on battles for select using (true);
create policy "battle_logs_select" on battle_logs for select using (true);

-- RLS 정책: insert 허용
create policy "users_insert" on users for insert with check (true);
create policy "battles_insert" on battles for insert with check (true);
create policy "battle_logs_insert" on battle_logs for insert with check (true);

-- RLS 정책: battles update (매칭용)
create policy "battles_update" on battles for update using (true);
