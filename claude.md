# 자전거 km 대결 앱 — Claude Code 가이드

## 프로젝트 개요

방 오너가 조건을 설정하고 링크/QR로 참여자를 모아 km 대결을 펼치는 앱.

- 방 생성 → 링크/QR 공유 → 참여 → 대결 → 결과
- 익명 닉네임만 공개, 개인정보 없음
- 1:1이 아닌 다대다 리더보드 방식

## 기술 스택

- **Framework**: React Native + Expo (expo-router)
- **Backend**: Supabase (DB + Realtime + Auth)
- **State**: TanStack Query v5
- **Styling**: NativeWind (Tailwind CSS)
- **Architecture**: FSD (Feature-Sliced Design)

## 폴더 구조

```
src/
  entities/
    room/            # 방 타입, API, queries
    participant/     # 참여자 타입, API, queries
    user/            # 유저 타입, 익명 닉네임
  features/
    create-room/     # 방 생성 (조건 설정)
    join-room/       # 링크/QR로 방 참여
    tracking/        # GPS km 측정 (expo-location)
    leaderboard/     # 실시간 순위 현황
  shared/
    lib/
      supabase.ts    # 기존 Supabase 클라이언트 (재사용)
      location.ts    # expo-location 래퍼
    ui/              # 기존 공통 컴포넌트 (재사용)
  pages/
    home/
    room/
    result/
```

## Supabase 테이블 스키마

```sql
-- 유저 (익명)
create table users (
  id uuid primary key default gen_random_uuid(),
  nickname text not null,          -- "빠른 치타" 형식 랜덤 생성
  created_at timestamptz default now()
);

-- 방
create table rooms (
  id uuid primary key default gen_random_uuid(),
  owner_id uuid references users(id),
  title text not null,             -- 방 이름 (ex: "한강 라이딩 대결")
  goal_km numeric,                 -- 목표 km (선택, null이면 무제한)
  duration_minutes int not null,   -- 대결 시간 (분 단위, ex: 60, 180, 1440)
  invite_code text unique not null, -- 초대 코드 (6자리, ex: "A3B9KZ")
  status text not null default 'waiting', -- waiting | active | finished
  started_at timestamptz,
  ends_at timestamptz,
  created_at timestamptz default now()
);

-- 참여자
create table participants (
  id uuid primary key default gen_random_uuid(),
  room_id uuid references rooms(id),
  user_id uuid references users(id),
  total_km numeric not null default 0,
  rank int,                        -- 최종 순위 (결과 시 계산)
  joined_at timestamptz default now(),
  unique(room_id, user_id)
);

-- km 기록 (라이딩 세션 단위)
create table ride_logs (
  id uuid primary key default gen_random_uuid(),
  room_id uuid references rooms(id),
  user_id uuid references users(id),
  km numeric not null,
  started_at timestamptz,
  ended_at timestamptz
);
```

## 핵심 사이클

### 1. 방 생성 (오너)

- 방 이름, 대결 시간(30분 / 1시간 / 3시간 / 하루), 목표 km(선택) 설정
- `invite_code` 자동 생성
- 링크 & QR 코드 화면으로 이동

### 2. 공유

- 링크: `bikebattle://room/join?code=A3B9KZ`
- QR: invite_code 기반 QR 이미지 생성 (`react-native-qrcode-svg`)
- 카카오톡, 인스타, 자전거 커뮤니티 등에 공유

### 3. 참여

- 링크/QR 스캔 → 앱 실행 → 닉네임 자동 배정 → 방 입장
- 오너가 [대결 시작] 누르면 `status = 'active'`, 카운트다운 시작
- 시작 전 대기 화면에서 현재 참여자 목록 실시간 표시

### 4. 대결

- 라이딩 시작/종료 버튼으로 GPS 트래킹
- 종료 시 km → `ride_logs` insert → `participants.total_km` 업데이트
- Supabase Realtime으로 실시간 리더보드 갱신
- `ends_at` 도달 시 자동으로 `status = 'finished'`

### 5. 결과

- 최종 km 기준 순위 계산
- 1등 강조 표시
- 결과 공유 버튼 (스크린샷 또는 텍스트 공유)

## 화면 구성

```
홈
├── [방 만들기] 버튼
└── 참여 코드 직접 입력 필드

방 만들기
├── 방 이름 입력
├── 대결 시간 선택 (30분 / 1시간 / 3시간 / 하루)
└── 목표 km 입력 (선택)

대기 화면 (방 생성 후)
├── QR 코드
├── 링크 공유 버튼
├── 참여자 실시간 목록
└── [대결 시작] 버튼 (오너만)

대결 화면
├── 실시간 리더보드 (순위 + 닉네임 + km)
├── 남은 시간
└── [라이딩 시작/종료] 버튼

결과 화면
├── 최종 순위 리스트
└── [결과 공유] 버튼
```

## 개발 순서 (MVP)

1. Supabase 테이블 생성
2. 익명 닉네임 자동 생성 + 유저 세팅 (AsyncStorage로 로컬 저장)
3. 방 생성 기능 (조건 설정 + invite_code 발급)
4. QR 코드 생성 + 링크 공유
5. 딥링크/QR 스캔으로 방 참여
6. 대기 화면 (참여자 실시간 목록)
7. GPS km 측정 기능
8. 실시간 리더보드
9. 대결 종료 + 결과 화면

## 코드 컨벤션

- 컴포넌트: PascalCase 함수형
- API 함수: camelCase, `src/entities/*/api/` 에 위치
- Query keys: `src/entities/*/queries/` 에 위치
- 타입: `src/entities/*/model/types.ts` 에 위치
- 익명 닉네임: `형용사 + 동물` 조합 랜덤 생성 (예: "빠른 치타", "용감한 독수리")
- 에러 처리: 모든 Supabase 호출은 try/catch 또는 error 체크 필수

## 커밋 컨벤션

기능 단위로 커밋한다. 커밋 메시지 형식은 아래를 따른다.

```
feat: 방 생성 기능 추가
fix: 딥링크 파싱 오류 수정
```

- `feat`: 새로운 기능 추가
- `fix`: 버그 수정
- 하나의 커밋에 여러 기능을 묶지 않는다
- 커밋 단위 예시:
  - `feat: Supabase rooms 테이블 생성`
  - `feat: 익명 닉네임 자동 생성 로직 추가`
  - `feat: 방 생성 화면 UI 구현`
  - `feat: QR 코드 생성 및 링크 공유 기능 추가`
  - `fix: 참여자 실시간 업데이트 누락 수정`

## FSD 아키텍처 & ESLint

이 프로젝트는 **Feature-Sliced Design(FSD)** 구조를 따르며, ESLint 플러그인(`eslint-plugin-fsd` 또는 동등한 플러그인)으로 레이어 간 의존성을 엄격하게 관리한다.

### 레이어 계층 (위로 갈수록 상위)

```
pages → features → entities → shared
```

### 핵심 규칙 — 반드시 준수

- **상위 레이어는 하위 레이어만 import 가능**
  - ✅ `features` → `entities`, `shared`
  - ✅ `pages` → `features`, `entities`, `shared`
  - ❌ `entities` → `features` (하위에서 상위 import 금지)
  - ❌ `shared` → `entities`, `features`, `pages`
- **같은 레이어 간 cross-import 금지**
  - ❌ `entities/room` → `entities/user` 직접 import 금지
  - ❌ `features/tracking` → `features/leaderboard` 직접 import 금지
- **각 슬라이스는 반드시 `index.ts`로만 외부에 노출**
  - ✅ `import { Room } from '@/entities/room'`
  - ❌ `import { Room } from '@/entities/room/model/types'` (내부 경로 직접 접근 금지)

### 슬라이스 내부 구조

```
entities/room/
  api/        # Supabase API 호출
  model/      # types.ts
  queries/    # TanStack Query queryOptions
  ui/         # 슬라이스 전용 컴포넌트
  index.ts    # 외부 공개 인터페이스 (public API)
```

### ESLint 오류 발생 시

- import 경로를 수정하되, 레이어 규칙을 우회하는 방식으로 해결하지 않는다
- 구조 자체를 바꿔야 한다면 반드시 FSD 규칙에 맞게 슬라이스를 재설계한다

## 주요 패키지

- `expo-location` — GPS 트래킹
- `expo-linking` — 딥링크 처리
- `react-native-qrcode-svg` — QR 코드 생성
- `expo-sharing` — 결과 공유

## 주의사항

- 위치 권한: `requestForegroundPermissionsAsync` 필수
- 백그라운드 트래킹: `app.json`에 백그라운드 위치 권한 설정 필요
- 딥링크: `app.json`에 scheme 등록 필요 (`"scheme": "bikebattle"`)
- Realtime: Supabase 프로젝트에서 Realtime 활성화 필요
- 유저 식별: 별도 로그인 없이 AsyncStorage에 uuid 저장해서 익명 유저 유지
