import { useMutation, useQueryClient } from '@tanstack/react-query';
import { View, Text, Pressable, ActivityIndicator } from 'react-native';

import { recordKm } from '@/entities/battle/api/battle';
import { battleKeys } from '@/entities/battle/queries/queryKey';

import { useRideTracking } from '../hooks/useRideTracking';

type Props = {
  battleId: string;
  userId: string;
};

export function RideTracker({ battleId, userId }: Props) {
  const queryClient = useQueryClient();
  const { state, totalKm, error, start, stop, reset } = useRideTracking();

  const { mutate: saveKm, isPending } = useMutation({
    mutationFn: (km: number) => recordKm(battleId, userId, km),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: battleKeys.logs(battleId) });
      reset();
    },
  });

  async function handleStop() {
    const km = stop();
    if (km > 0) {
      saveKm(km);
    } else {
      reset();
    }
  }

  return (
    <View className="bg-gray-900 rounded-2xl p-6 mx-6 mb-6">
      {/* km 표시 */}
      <View className="items-center mb-6">
        <Text className="text-gray-400 text-sm mb-1">이번 라이딩</Text>
        <Text className="text-white text-5xl font-bold">
          {totalKm.toFixed(2)}
        </Text>
        <Text className="text-gray-400">km</Text>
      </View>

      {/* 상태 인디케이터 */}
      {state === 'riding' && (
        <View className="flex-row items-center justify-center mb-4 gap-2">
          <View className="w-2 h-2 rounded-full bg-green-400" />
          <Text className="text-green-400 text-sm">측정 중</Text>
        </View>
      )}

      {error ? (
        <Text className="text-red-400 text-sm text-center mb-4">{error}</Text>
      ) : null}

      {/* 버튼 */}
      {state === 'idle' && (
        <Pressable
          onPress={start}
          className="bg-green-500 py-4 rounded-xl items-center"
        >
          <Text className="text-white font-bold text-base">🚴 라이딩 시작</Text>
        </Pressable>
      )}

      {state === 'riding' && (
        <Pressable
          onPress={handleStop}
          className="bg-red-500 py-4 rounded-xl items-center"
        >
          <Text className="text-white font-bold text-base">⏹ 라이딩 종료</Text>
        </Pressable>
      )}

      {state === 'stopped' && (
        <View className="items-center gap-3">
          {isPending ? (
            <ActivityIndicator color="white" />
          ) : (
            <Text className="text-gray-400 text-sm">저장 완료</Text>
          )}
        </View>
      )}
    </View>
  );
}
