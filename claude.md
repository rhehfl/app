# 자전거 km 대결 앱 — Claude Code 가이드

## Claude 행동 규칙

- **기능 단위 자동 커밋**: 기능 하나 구현 완료 시마다 사용자 요청 없이 자동으로 `git commit`
- 커밋 메시지 형식: `feat: 기능명` (한국어 설명)

## 프로젝트 개요

랜덤 익명 1:1 자전거 km 대결 앱.

- 대결 신청 → 랜덤 매칭 → 기간 내 km 측정 → 승패 결정
- 익명 닉네임만 공개, 개인정보 없음

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
    battle/          # 대결 타입, API, queries
    user/            # 유저 타입, 익명 닉네임
  features/
    matching/        # 대결 신청, 매칭 대기
    tracking/        # GPS km 측정 (expo-location)
    battle-view/     # 실시간 대결 현황
  shared/
    lib/
      supabase.ts    # 기존 Supabase 클라이언트 (재사용)
      location.ts    # expo-location 래퍼
    ui/              # 기존 공통 컴포넌트 (재사용)
  pages/
    home/
    battle/
    result/
```

## Supabase 테이블 스키마

```sql
-- 유저 (익명)
create table users (
  id uuid primary key default gen_random_uuid(),
  nickname text not null,
  created_at timestamptz default now()
);

-- 대결
create table battles (
  id uuid primary key default gen_random_uuid(),
  user1_id uuid references users(id),
  user2_id uuid references users(id),
  duration_days int not null default 7,  -- 1 | 3 | 7
  status text not null default 'waiting', -- waiting | active | finished
  winner_id uuid references users(id),
  started_at timestamptz,
  ends_at timestamptz,
  created_at timestamptz default now()
);

-- km 기록
create table battle_logs (
  id uuid primary key default gen_random_uuid(),
  battle_id uuid references battles(id),
  user_id uuid references users(id),
  km numeric not null,
  recorded_at timestamptz default now()
);
```

## 핵심 로직

### 매칭

1. `battles` 테이블에서 `status = 'waiting'` AND `user2_id IS NULL` 인 row 조회
2. 있으면 → 해당 row의 `user2_id` 업데이트, `status = 'active'`, `started_at`, `ends_at` 설정
3. 없으면 → 새 row 생성 (`user1_id`만 세팅, 대기)

### 실시간 km 동기화

- Supabase Realtime으로 `battle_logs` 테이블 구독
- 상대방 km 변경 시 자동 UI 업데이트

### GPS 트래킹

- `expo-location` 사용
- 라이딩 시작/종료 버튼으로 백그라운드 트래킹
- 종료 시 총 km를 `battle_logs`에 insert

## 개발 순서 (MVP)

1. Supabase 테이블 생성 + 익명 닉네임 자동 생성
2. 매칭 로직 구현
3. GPS km 측정 기능
4. 실시간 대결 현황 화면
5. 승패 결과 화면

## 코드 컨벤션

- 컴포넌트: PascalCase 함수형
- API 함수: camelCase, `src/entities/*/api/` 에 위치
- Query keys: `src/entities/*/queries/` 에 위치
- 타입: `src/entities/*/model/types.ts` 에 위치
- 익명 닉네임: `형용사 + 동물` 조합 랜덤 생성 (예: "빠른 치타", "용감한 독수리")
- 에러 처리: 모든 Supabase 호출은 try/catch 또는 error 체크 필수

## Import 순서 규칙 (eslint import/order — 위반 시 에러)

그룹 사이에 반드시 빈 줄 1개. 그룹 내 알파벳 오름차순(대소문자 무시).

```ts
// 1. react (단독)
import { useState } from 'react';

// 2. 기타 external — 알파벳순: @react-native-* → @tanstack/* → expo-* → react-native
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useQuery } from '@tanstack/react-query';
import { useRouter } from 'expo-router';
import { View } from 'react-native';

// 3. @/features/**
import { RideTracker } from '@/features/tracking/ui/RideTracker';

// 4. @/entities/**
import { getBattleById } from '@/entities/battle/api/battle';

// 5. @/shared/**
import { supabase } from '@/shared/lib/supabase';

// 6. relative (../ 또는 ./)
import type { Battle } from '../model/types';
```

- FSD 레이어 간에도 각각 빈 줄 필수 (features / entities / shared 모두 별도 그룹)
- `react`가 없으면 external 그룹만 작성, 빈 줄 후 internal 시작
- `import type`도 동일한 규칙 적용

## Expo Router 타입 라우팅 규칙 (typedRoutes: true)

```ts
// ❌ 에러 — 동적 경로에 템플릿 리터럴 사용 금지
router.replace(`/battle/${id}`)

// ✅ 동적 경로는 반드시 객체 형식
router.replace({ pathname: '/battle/[id]', params: { id } })
router.replace({ pathname: '/result/[id]', params: { id } })

// ✅ 정적 경로는 문자열 그대로 사용 가능
router.replace('/')
```

## 주의사항

- 위치 권한: `expo-location`의 `requestForegroundPermissionsAsync` 필수
- 백그라운드 트래킹: `app.json`에 백그라운드 위치 권한 설정 필요
- Realtime: Supabase 프로젝트에서 Realtime 활성화 필요
