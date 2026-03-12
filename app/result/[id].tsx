import { useEffect, useState } from 'react';

import AsyncStorage from '@react-native-async-storage/async-storage';
import { useQuery } from '@tanstack/react-query';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { View, Text, Pressable, ActivityIndicator } from 'react-native';

import { getBattleWithUsers, getBattleLogs } from '@/entities/battle/api/battle';
import { battleKeys } from '@/entities/battle/queries/queryKey';

export default function ResultScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const [myId, setMyId] = useState<string | null>(null);
  const [myNickname, setMyNickname] = useState('');

  useEffect(() => {
    AsyncStorage.getItem('userId').then(setMyId);
    AsyncStorage.getItem('userNickname').then((n) => setMyNickname(n ?? ''));
  }, []);

  const { data, isLoading } = useQuery({
    queryKey: [...battleKeys.detail(id), 'with-users'],
    queryFn: () => getBattleWithUsers(id),
    enabled: !!myId,
  });

  const { data: logs } = useQuery({
    queryKey: battleKeys.logs(id),
    queryFn: () => getBattleLogs(id),
    enabled: !!data,
  });

  if (isLoading || !data || !myId) {
    return (
      <View className="flex-1 bg-gray-950 items-center justify-center">
        <ActivityIndicator color="white" />
      </View>
    );
  }

  const { battle, user1Nickname, user2Nickname } = data;
  const isWin = battle.winner_id === myId;

  const opponentId = battle.user1_id === myId ? battle.user2_id : battle.user1_id;
  const opponentNickname =
    battle.user1_id === myId ? user2Nickname : user1Nickname;

  const totalKm = (userId: string) =>
    (logs ?? [])
      .filter((l) => l.user_id === userId)
      .reduce((sum, l) => sum + l.km, 0)
      .toFixed(1);

  const myKm = totalKm(myId);
  const opponentKm = opponentId ? totalKm(opponentId) : '0.0';
  const diff = Math.abs(parseFloat(myKm) - parseFloat(opponentKm)).toFixed(1);

  return (
    <View className="flex-1 bg-gray-950 px-6">
      <View className="flex-1 items-center justify-center">
        {/* 결과 아이콘 */}
        <Text className="text-8xl mb-4">{isWin ? '🏆' : '😔'}</Text>
        <Text className="text-white text-4xl font-bold mb-2">
          {isWin ? '승리!' : '패배'}
        </Text>
        <Text className="text-gray-400 text-base mb-12">
          {isWin
            ? `${diff}km 차이로 이겼습니다`
            : `${diff}km 차이로 졌습니다`}
        </Text>

        {/* 스코어 카드 */}
        <View className="w-full bg-gray-900 rounded-2xl p-6 mb-8">
          <View className="flex-row justify-between items-center mb-4">
            <View className="flex-1">
              <Text className="text-gray-400 text-xs mb-1">
                {myNickname || '나'}
              </Text>
              <Text
                className={`text-3xl font-bold ${isWin ? 'text-yellow-400' : 'text-white'}`}
              >
                {myKm} km
              </Text>
            </View>
            <Text className="text-gray-600 text-lg px-4">vs</Text>
            <View className="flex-1 items-end">
              <Text className="text-gray-400 text-xs mb-1">
                {opponentNickname ?? '상대'}
              </Text>
              <Text
                className={`text-3xl font-bold ${!isWin ? 'text-yellow-400' : 'text-white'}`}
              >
                {opponentKm} km
              </Text>
            </View>
          </View>

          <View className="border-t border-gray-800 pt-4">
            <Text className="text-gray-500 text-xs text-center">
              {battle.duration_days}일 대결 ·{' '}
              {battle.ends_at
                ? new Date(battle.ends_at).toLocaleDateString('ko-KR')
                : ''}
            </Text>
          </View>
        </View>
      </View>

      {/* 다시 도전 */}
      <Pressable
        onPress={() => router.replace('/')}
        className="bg-blue-500 py-4 rounded-2xl items-center mb-10"
      >
        <Text className="text-white font-bold text-lg">다시 도전 🚴</Text>
      </Pressable>
    </View>
  );
}
