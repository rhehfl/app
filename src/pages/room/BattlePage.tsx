import { Suspense, useEffect, useRef, useState } from 'react';

import { router } from 'expo-router';
import { ActivityIndicator, Alert, SafeAreaView, View } from 'react-native';

import { Leaderboard } from '@/features/leaderboard';
import { TrackingButton } from '@/features/tracking';
import type { TrackingResult } from '@/features/tracking';

import { logRide, finalizeRanks } from '@/entities/participant';
import { getRoomById, finishRoom } from '@/entities/room';
import type { Room } from '@/entities/room';

import { getLocalUser } from '@/shared/lib/user';
import { Text } from '@/shared/ui/text';


interface BattlePageProps {
  roomId: string;
}

function formatRemaining(ms: number): string {
  if (ms <= 0) return '00:00';
  const totalSec = Math.floor(ms / 1000);
  const h = Math.floor(totalSec / 3600);
  const m = Math.floor((totalSec % 3600) / 60);
  const s = totalSec % 60;
  if (h > 0) return `${h}:${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
  return `${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
}

export function BattlePage({ roomId }: BattlePageProps) {
  const [room, setRoom] = useState<Room | null>(null);
  const [localUserId, setLocalUserId] = useState('');
  const [remaining, setRemaining] = useState(0);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    async function init() {
      const [localUser, roomData] = await Promise.all([getLocalUser(), getRoomById(roomId)]);
      setLocalUserId(localUser.id);
      setRoom(roomData);

      if (roomData.ends_at) {
        const end = new Date(roomData.ends_at).getTime();
        const tick = () => {
          const diff = end - Date.now();
          if (diff <= 0) {
            clearInterval(timerRef.current!);
            void handleFinish(roomData);
          } else {
            setRemaining(diff);
          }
        };
        tick();
        timerRef.current = setInterval(tick, 1000);
      }
    }

    void init();
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [roomId]);

  async function handleFinish(roomData: Room) {
    try {
      await finalizeRanks(roomData.id);
      await finishRoom(roomData.id);
      router.replace(`/room/${roomData.id}/result`);
    } catch {
      Alert.alert('오류', '대결 종료 처리에 실패했습니다.');
    }
  }

  async function handleTrackingStop(result: TrackingResult) {
    try {
      await logRide(roomId, localUserId, result.km, result.startedAt, result.endedAt);
    } catch {
      Alert.alert('오류', 'km 기록에 실패했습니다.');
    }
  }

  return (
    <SafeAreaView className="flex-1 bg-gray-50">
      <View className="flex-1 gap-4 px-4 pt-4">
        <View className="items-center rounded-2xl bg-primary py-4">
          <Text className="text-xs font-semibold uppercase tracking-widest text-white/70">
            남은 시간
          </Text>
          <Text className="text-4xl font-bold text-white">{formatRemaining(remaining)}</Text>
          {room?.goal_km && (
            <Text className="mt-1 text-sm text-white/70">목표 {room.goal_km}km</Text>
          )}
        </View>

        <View className="flex-1">
          <Text className="mb-2 text-sm font-semibold text-gray-500">실시간 순위</Text>
          <Suspense fallback={<ActivityIndicator />}>
            <Leaderboard roomId={roomId} currentUserId={localUserId} />
          </Suspense>
        </View>

        <View className="pb-4">
          <TrackingButton onStop={handleTrackingStop} />
        </View>
      </View>
    </SafeAreaView>
  );
}
