import { View, Text, Pressable, ActivityIndicator } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useQuery } from '@tanstack/react-query';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { getBattleById, getBattleLogs } from '@/entities/battle/api/battle';
import { battleKeys } from '@/entities/battle/queries/queryKey';

export default function ResultScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();

  const { data: battle, isLoading } = useQuery({
    queryKey: battleKeys.detail(id),
    queryFn: () => getBattleById(id),
  });

  const { data: logs } = useQuery({
    queryKey: battleKeys.logs(id),
    queryFn: () => getBattleLogs(id),
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

  const myId = battle.user1_id;
  const myKm = parseFloat(myId ? totalKm(myId) : '0');
  const opponentKm = parseFloat(
    battle.user2_id ? totalKm(battle.user2_id) : '0'
  );
  const isWin = battle.winner_id === myId;

  return (
    <View className="flex-1 bg-gray-950 items-center justify-center px-6">
      <Text className="text-6xl mb-4">{isWin ? '🏆' : '😔'}</Text>
      <Text className="text-white text-4xl font-bold mb-2">
        {isWin ? '승리!' : '패배'}
      </Text>
      <Text className="text-gray-400 text-base mb-12">
        나 {myKm}km vs 상대 {opponentKm}km
      </Text>

      <Pressable
        onPress={() => router.replace('/')}
        className="bg-blue-500 w-full py-4 rounded-2xl items-center"
      >
        <Text className="text-white font-bold text-lg">다시 도전</Text>
      </Pressable>
    </View>
  );
}
