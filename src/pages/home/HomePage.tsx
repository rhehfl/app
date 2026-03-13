import { useState } from 'react';

import { router } from 'expo-router';
import { Alert, SafeAreaView, View } from 'react-native';

import { JoinRoomForm } from '@/features/join-room';

import { joinRoom } from '@/entities/participant';
import { getRoomByInviteCode } from '@/entities/room';
import { getOrCreateUser } from '@/entities/user';

import { getLocalUser } from '@/shared/lib/user';
import { Button } from '@/shared/ui/button';
import { Text } from '@/shared/ui/text';


export function HomePage() {
  const [isJoining, setIsJoining] = useState(false);

  async function handleJoin(code: string) {
    setIsJoining(true);
    try {
      const localUser = await getLocalUser();
      await getOrCreateUser(localUser.id, localUser.nickname);
      const room = await getRoomByInviteCode(code);
      await joinRoom(room.id, localUser.id);
      router.push(`/room/${room.id}/waiting`);
    } catch {
      Alert.alert('오류', '방을 찾을 수 없습니다. 코드를 확인해주세요.');
    } finally {
      setIsJoining(false);
    }
  }

  return (
    <SafeAreaView className="flex-1 bg-gray-50">
      <View className="flex-1 justify-center px-6 gap-8">
        <View className="items-center gap-2">
          <Text className="text-4xl font-bold text-primary">🚴 대결</Text>
          <Text className="text-base text-gray-500 text-center">
            자전거 km 대결을 시작하세요
          </Text>
        </View>

        <Button
          size="lg"
          onPress={() => router.push('/room/create')}
        >
          <Text>방 만들기</Text>
        </Button>

        <View className="gap-3">
          <Text className="text-sm font-semibold text-gray-500 text-center">
            또는 초대 코드로 참여
          </Text>
          <JoinRoomForm onSubmit={handleJoin} isLoading={isJoining} />
        </View>
      </View>
    </SafeAreaView>
  );
}
