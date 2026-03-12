import { View, Text, Pressable, ActivityIndicator } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useQuery } from '@tanstack/react-query';
import { getBattleById, getBattleLogs } from '@/entities/battle/api/battle';
import { battleKeys } from '@/entities/battle/queries/queryKey';

export default function BattleScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();

  const { data: battle, isLoading } = useQuery({
    queryKey: battleKeys.detail(id),
    queryFn: () => getBattleById(id),
    refetchInterval: 5000,
  });

  const { data: logs } = useQuery({
    queryKey: battleKeys.logs(id),
    queryFn: () => getBattleLogs(id),
    refetchInterval: 5000,
    enabled: !!battle,
  });

  if (isLoading || !battle) {
    return (
      <View className="flex-1 bg-gray-950 items-center justify-center">
        <ActivityIndicator color="white" />
      </View>
    );
  }

  const totalKm = (userId: string) =>
    (logs ?? [])
      .filter((l) => l.user_id === userId)
      .reduce((sum, l) => sum + l.km, 0)
      .toFixed(1);

  return (
    <View className="flex-1 bg-gray-950 px-6 pt-16">
      <Text className="text-white text-2xl font-bold mb-2">🚴 대결 현황</Text>
      <Text className="text-gray-400 text-sm mb-10">
        종료:{' '}
        {battle.ends_at
          ? new Date(battle.ends_at).toLocaleDateString('ko-KR')
          : '-'}
      </Text>

      <View className="flex-row justify-between mb-10">
        <View className="items-center flex-1">
          <Text className="text-gray-400 text-xs mb-1">나</Text>
          <Text className="text-white text-5xl font-bold">
            {battle.user1_id ? totalKm(battle.user1_id) : '0.0'}
          </Text>
          <Text className="text-gray-400">km</Text>
        </View>
        <Text className="text-gray-600 text-3xl self-center">vs</Text>
        <View className="items-center flex-1">
          <Text className="text-gray-400 text-xs mb-1">상대</Text>
          <Text className="text-white text-5xl font-bold">
            {battle.user2_id ? totalKm(battle.user2_id) : '0.0'}
          </Text>
          <Text className="text-gray-400">km</Text>
        </View>
      </View>

      {battle.status === 'finished' && (
        <Pressable
          onPress={() => router.replace(`/result/${id}`)}
          className="bg-blue-500 py-4 rounded-2xl items-center"
        >
          <Text className="text-white font-bold text-lg">결과 보기</Text>
        </Pressable>
      )}
    </View>
  );
}
