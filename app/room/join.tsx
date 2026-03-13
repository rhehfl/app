import { useEffect, useState } from 'react';

import { router, useLocalSearchParams } from 'expo-router';
import { Alert, SafeAreaView, View } from 'react-native';

import { JoinRoomForm } from '@/features/join-room';

import { joinRoom } from '@/entities/participant';
import { getRoomByInviteCode } from '@/entities/room';
import { getOrCreateUser } from '@/entities/user';

import { getLocalUser } from '@/shared/lib/user';




export default function JoinRoomScreen() {
  const { code } = useLocalSearchParams<{ code?: string }>();
  const [isLoading, setIsLoading] = useState(false);

  // Handle deep link: bikebattle://room/join?code=XXXXXX
  useEffect(() => {
    if (code) void handleJoin(code);
  }, [code]);

  async function handleJoin(inviteCode: string) {
    setIsLoading(true);
    try {
      const localUser = await getLocalUser();
      await getOrCreateUser(localUser.id, localUser.nickname);
      const room = await getRoomByInviteCode(inviteCode);
      await joinRoom(room.id, localUser.id);
      router.replace(`/room/${room.id}/waiting`);
    } catch {
      Alert.alert('오류', '방을 찾을 수 없습니다. 코드를 확인해주세요.');
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <SafeAreaView className="flex-1 bg-gray-50">
      <View className="flex-1 justify-center px-6">
        <JoinRoomForm onSubmit={handleJoin} isLoading={isLoading} />
      </View>
    </SafeAreaView>
  );
}
