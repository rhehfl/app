import { useEffect, useState, useCallback } from 'react';

import AsyncStorage from '@react-native-async-storage/async-storage';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { useLocalSearchParams, useRouter } from 'expo-router';
import {
  View,
  Text,
  Pressable,
  ActivityIndicator,
  ScrollView,
} from 'react-native';

import { RideTracker } from '@/features/tracking/ui/RideTracker';

import {
  getBattleById,
  getBattleLogs,
  finalizeBattle,
} from '@/entities/battle/api/battle';
import { battleKeys } from '@/entities/battle/queries/queryKey';

import { supabase } from '@/shared/lib/supabase';

export default function BattleScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const queryClient = useQueryClient();
  const [myId, setMyId] = useState<string | null>(null);

  useEffect(() => {
    AsyncStorage.getItem('userId').then(setMyId);
  }, []);

  const { data: battle, isLoading } = useQuery({
    queryKey: battleKeys.detail(id),
    queryFn: () => getBattleById(id),
    refetchInterval: 5000,
  });

  const { data: logs, refetch: refetchLogs } = useQuery({
    queryKey: battleKeys.logs(id),
    queryFn: () => getBattleLogs(id),
    enabled: !!battle,
  });

  // 대결 종료 감지 → DB 함수 호출
  const checkAndFinalize = useCallback(async () => {
    if (!battle || battle.status !== 'active' || !battle.ends_at) return;
    if (new Date(battle.ends_at) > new Date()) return;

    try {
      await finalizeBattle(id);
      queryClient.invalidateQueries({ queryKey: battleKeys.detail(id) });
    } catch {
      // 이미 다른 클라이언트가 처리했을 수 있으므로 무시
    }
  }, [battle, id, queryClient]);

  useEffect(() => {
    checkAndFinalize();
  }, [checkAndFinalize]);

  // Realtime 구독
  useEffect(() => {
    const logsChannel = supabase
      .channel(`battle_logs:${id}`)
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'battle_logs',
          filter: `battle_id=eq.${id}`,
        },
        () => refetchLogs(),
      )
      .subscribe();

    const battleChannel = supabase
      .channel(`battle:${id}`)
      .on(
        'postgres_changes',
        {
          event: 'UPDATE',
          schema: 'public',
          table: 'battles',
          filter: `id=eq.${id}`,
        },
        () =>
          queryClient.invalidateQueries({ queryKey: battleKeys.detail(id) }),
      )
      .subscribe();

    return () => {
      supabase.removeChannel(logsChannel);
      supabase.removeChannel(battleChannel);
    };
  }, [id, refetchLogs, queryClient]);

  if (isLoading || !battle || !myId) {
    return (
      <View className="flex-1 bg-gray-950 items-center justify-center">
        <ActivityIndicator color="white" />
      </View>
    );
  }

  const opponentId =
    battle.user1_id === myId ? battle.user2_id : battle.user1_id;

  const totalKm = (userId: string) =>
    (logs ?? [])
      .filter((l) => l.user_id === userId)
      .reduce((sum, l) => sum + l.km, 0)
      .toFixed(1);

  const myKm = totalKm(myId);
  const opponentKm = opponentId ? totalKm(opponentId) : '0.0';
  const isWinning = parseFloat(myKm) >= parseFloat(opponentKm);

  const daysLeft = battle.ends_at
    ? Math.max(
        0,
        Math.ceil((new Date(battle.ends_at).getTime() - Date.now()) / 86400000),
      )
    : null;

  return (
    <ScrollView className="flex-1 bg-gray-950">
      {/* 헤더 */}
      <View className="px-6 pt-16 pb-6">
        <Text className="text-white text-2xl font-bold mb-1">🚴 대결 현황</Text>
        {daysLeft !== null && (
          <Text className="text-gray-400 text-sm">
            {battle.status === 'finished'
              ? '대결 종료'
              : daysLeft > 0
                ? `D-${daysLeft} 남음`
                : '오늘 종료'}
          </Text>
        )}
      </View>

      {/* 스코어보드 */}
      <View className="flex-row px-6 mb-8 gap-3">
        <View
          className={`items-center flex-1 rounded-2xl py-6 ${
            battle.status === 'finished' && battle.winner_id === myId
              ? 'bg-yellow-500/20 border border-yellow-500/40'
              : 'bg-blue-900/40'
          }`}
        >
          <Text className="text-blue-300 text-xs mb-2 font-semibold">
            {battle.status === 'finished' && battle.winner_id === myId
              ? '🏆 나 (승)'
              : '나'}
          </Text>
          <Text className="text-white text-5xl font-bold">{myKm}</Text>
          <Text className="text-gray-400 text-sm">km</Text>
        </View>

        <View className="items-center justify-center">
          <Text className="text-gray-600 text-xl font-bold">vs</Text>
          {battle.status === 'active' && (
            <Text
              className={`text-xs mt-1 ${isWinning ? 'text-green-400' : 'text-red-400'}`}
            >
              {isWinning ? '우세' : '열세'}
            </Text>
          )}
        </View>

        <View
          className={`items-center flex-1 rounded-2xl py-6 ${
            battle.status === 'finished' && battle.winner_id === opponentId
              ? 'bg-yellow-500/20 border border-yellow-500/40'
              : 'bg-gray-800'
          }`}
        >
          <Text className="text-gray-400 text-xs mb-2 font-semibold">
            {battle.status === 'finished' && battle.winner_id === opponentId
              ? '🏆 상대 (승)'
              : '상대'}
          </Text>
          <Text className="text-white text-5xl font-bold">{opponentKm}</Text>
          <Text className="text-gray-400 text-sm">km</Text>
        </View>
      </View>

      {/* GPS 트래커 */}
      {battle.status === 'active' && myId && (
        <RideTracker battleId={id} userId={myId} />
      )}

      {/* 대기 중 */}
      {battle.status === 'waiting' && (
        <View className="items-center px-6 py-8">
          <ActivityIndicator color="#60a5fa" />
          <Text className="text-gray-400 text-sm mt-4">
            상대를 기다리는 중...
          </Text>
        </View>
      )}

      {/* 종료 → 결과 화면으로 */}
      {battle.status === 'finished' && (
        <View className="px-6 mt-4">
          <Pressable
            onPress={() =>
              router.replace({ pathname: './result/[id]', params: { id } })
            }
            className="bg-blue-500 py-4 rounded-2xl items-center"
          >
            <Text className="text-white font-bold text-lg">최종 결과 보기</Text>
          </Pressable>
        </View>
      )}
    </ScrollView>
  );
}
