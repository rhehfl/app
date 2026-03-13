import { useEffect, useState } from 'react';

import { router } from 'expo-router';
import { SafeAreaView, ScrollView, Share, View } from 'react-native';

import { getParticipants } from '@/entities/participant';
import type { Participant } from '@/entities/participant';
import { ParticipantItem } from '@/entities/participant/ui';
import { getRoomById } from '@/entities/room';
import type { Room } from '@/entities/room';

import { getLocalUser } from '@/shared/lib/user';
import { Button } from '@/shared/ui/button';
import { Text } from '@/shared/ui/text';



interface ResultPageProps {
  roomId: string;
}

export function ResultPage({ roomId }: ResultPageProps) {
  const [room, setRoom] = useState<Room | null>(null);
  const [participants, setParticipants] = useState<Participant[]>([]);
  const [localUserId, setLocalUserId] = useState('');

  useEffect(() => {
    async function load() {
      const [localUser, roomData, participantsData] = await Promise.all([
        getLocalUser(),
        getRoomById(roomId),
        getParticipants(roomId),
      ]);
      setLocalUserId(localUser.id);
      setRoom(roomData);
      setParticipants(participantsData);
    }
    void load();
  }, [roomId]);

  async function handleShare() {
    if (!room || participants.length === 0) return;
    const top3 = participants
      .slice(0, 3)
      .map((p, i) => `${i + 1}. ${p.users?.nickname ?? '익명'} - ${p.total_km.toFixed(2)}km`)
      .join('\n');
    await Share.share({
      message: `🚴 [${room.title}] 자전거 대결 결과\n\n${top3}\n\n자전거 km 대결 앱으로 도전해보세요!`,
    });
  }

  const winner = participants[0];

  return (
    <SafeAreaView className="flex-1 bg-gray-50">
      <ScrollView contentContainerStyle={{ padding: 24, gap: 20 }}>
        <View className="items-center gap-2">
          <Text className="text-3xl font-bold text-gray-900">🏁 결과</Text>
          {room && <Text className="text-base text-gray-500">{room.title}</Text>}
        </View>

        {winner && (
          <View className="items-center rounded-2xl bg-yellow-50 py-6 gap-2 border border-yellow-200">
            <Text className="text-5xl">🥇</Text>
            <Text className="text-xl font-bold text-gray-900">
              {winner.users?.nickname ?? '익명'}
            </Text>
            <Text className="text-2xl font-bold text-yellow-600">
              {winner.total_km.toFixed(2)} km
            </Text>
          </View>
        )}

        <View className="gap-3">
          <Text className="text-sm font-semibold text-gray-500">전체 순위</Text>
          {participants.map((p, i) => (
            <ParticipantItem
              key={p.id}
              participant={p}
              rank={i + 1}
              isCurrentUser={p.user_id === localUserId}
            />
          ))}
        </View>

        <View className="gap-3">
          <Button size="lg" onPress={handleShare}>
            <Text>결과 공유</Text>
          </Button>
          <Button variant="outline" onPress={() => router.replace('/')}>
            <Text>홈으로</Text>
          </Button>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
