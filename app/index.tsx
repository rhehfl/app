import { useState } from 'react';
import { View, Text, Pressable, ActivityIndicator } from 'react-native';
import { useRouter } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { createAnonymousUser } from '@/entities/user/api/createUser';
import { findOrCreateBattle } from '@/entities/battle/api/battle';
import type { DurationDays } from '@/entities/battle/model/types';

const DURATION_OPTIONS: { label: string; value: DurationDays }[] = [
  { label: '1일', value: 1 },
  { label: '3일', value: 3 },
  { label: '7일', value: 7 },
];

export default function HomeScreen() {
  const router = useRouter();
  const [duration, setDuration] = useState<DurationDays>(7);
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState('');

  async function handleStart() {
    setLoading(true);
    try {
      // 유저 생성 또는 기존 유저 재사용
      let userId = await AsyncStorage.getItem('userId');
      if (!userId) {
        setStatus('익명 닉네임 생성 중...');
        const user = await createAnonymousUser();
        userId = user.id;
        await AsyncStorage.setItem('userId', userId);
        await AsyncStorage.setItem('userNickname', user.nickname);
      }

      setStatus('상대 탐색 중...');
      const battle = await findOrCreateBattle(userId, duration);

      if (battle.status === 'active') {
        router.replace(`/battle/${battle.id}`);
      } else {
        // 대기 상태
        setStatus(`매칭 대기 중... (대결 ID: ${battle.id.slice(0, 8)})`);
      }
    } catch (e) {
      setStatus('오류가 발생했습니다. 다시 시도해주세요.');
    } finally {
      setLoading(false);
    }
  }

  return (
    <View className="flex-1 bg-gray-950 items-center justify-center px-6">
      <Text className="text-white text-4xl font-bold mb-2">🚴 대결</Text>
      <Text className="text-gray-400 text-base mb-12">
        랜덤 익명 1:1 자전거 km 대결
      </Text>

      <Text className="text-white text-lg font-semibold mb-4">대결 기간</Text>
      <View className="flex-row gap-3 mb-12">
        {DURATION_OPTIONS.map((opt) => (
          <Pressable
            key={opt.value}
            onPress={() => setDuration(opt.value)}
            className={`px-6 py-3 rounded-full border ${
              duration === opt.value
                ? 'bg-blue-500 border-blue-500'
                : 'border-gray-600'
            }`}
          >
            <Text
              className={`font-semibold ${
                duration === opt.value ? 'text-white' : 'text-gray-400'
              }`}
            >
              {opt.label}
            </Text>
          </Pressable>
        ))}
      </View>

      <Pressable
        onPress={handleStart}
        disabled={loading}
        className="bg-blue-500 w-full py-4 rounded-2xl items-center"
      >
        {loading ? (
          <ActivityIndicator color="white" />
        ) : (
          <Text className="text-white text-lg font-bold">대결 신청</Text>
        )}
      </Pressable>

      {status ? (
        <Text className="text-gray-400 text-sm mt-6 text-center">{status}</Text>
      ) : null}
    </View>
  );
}
