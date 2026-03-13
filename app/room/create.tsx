import { useState } from 'react';

import { router } from 'expo-router';
import { Alert } from 'react-native';

import { CreateRoomForm } from '@/features/create-room';
import type { CreateRoomFormValues } from '@/features/create-room';

import { joinRoom } from '@/entities/participant';
import { createRoom } from '@/entities/room';
import { getOrCreateUser } from '@/entities/user';

import { generateInviteCode } from '@/shared/lib/inviteCode';
import { getLocalUser } from '@/shared/lib/user';




export default function CreateRoomScreen() {
  const [isLoading, setIsLoading] = useState(false);

  async function handleSubmit(values: CreateRoomFormValues) {
    setIsLoading(true);
    try {
      const localUser = await getLocalUser();
      await getOrCreateUser(localUser.id, localUser.nickname);

      const room = await createRoom({
        owner_id: localUser.id,
        title: values.title,
        duration_minutes: values.duration_minutes,
        goal_km: values.goal_km,
        invite_code: generateInviteCode(),
      });

      await joinRoom(room.id, localUser.id);
      router.replace(`/room/${room.id}/waiting`);
    } catch {
      Alert.alert('오류', '방 생성에 실패했습니다. 다시 시도해주세요.');
    } finally {
      setIsLoading(false);
    }
  }

  return <CreateRoomForm onSubmit={handleSubmit} isLoading={isLoading} />;
}
