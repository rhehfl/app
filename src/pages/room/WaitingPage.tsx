import { useEffect, useState } from 'react';

import * as Linking from 'expo-linking';
import { router } from 'expo-router';
import { Alert, Pressable, SafeAreaView, ScrollView, Share, View } from 'react-native';
import QRCode from 'react-native-qrcode-svg';

import { getParticipants, joinRoom } from '@/entities/participant';
import type { Participant } from '@/entities/participant';
import { ParticipantItem } from '@/entities/participant/ui';
import { getRoomById, startRoom } from '@/entities/room';
import type { Room } from '@/entities/room';
import { RoomStatusBadge } from '@/entities/room/ui';

import { supabase } from '@/shared/lib/supabase';
import { getLocalUser } from '@/shared/lib/user';
import { Button } from '@/shared/ui/button';
import { Text } from '@/shared/ui/text';


interface WaitingPageProps {
  roomId: string;
}

export function WaitingPage({ roomId }: WaitingPageProps) {
  const [room, setRoom] = useState<Room | null>(null);
  const [participants, setParticipants] = useState<Participant[]>([]);
  const [localUserId, setLocalUserId] = useState('');
  const [isStarting, setIsStarting] = useState(false);

  useEffect(() => {
    let isMounted = true;

    async function init() {
      try {
        const localUser = await getLocalUser();
        if (!isMounted) return;
        setLocalUserId(localUser.id);

        const [roomData, participantsData] = await Promise.all([
          getRoomById(roomId),
          getParticipants(roomId),
        ]);
        if (!isMounted) return;
        setRoom(roomData);
        setParticipants(participantsData);

        // Ensure joined
        await joinRoom(roomId, localUser.id);
      } catch {
        Alert.alert('오류', '방 정보를 불러올 수 없습니다.');
      }
    }

    void init();

    const channel = supabase
      .channel(`waiting:${roomId}`)
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'participants', filter: `room_id=eq.${roomId}` },
        async () => {
          const updated = await getParticipants(roomId);
          if (isMounted) setParticipants(updated);
        }
      )
      .on(
        'postgres_changes',
        { event: 'UPDATE', schema: 'public', table: 'rooms', filter: `id=eq.${roomId}` },
        (payload) => {
          const updated = payload.new as Room;
          if (!isMounted) return;
          setRoom(updated);
          if (updated.status === 'active') {
            router.replace(`/room/${roomId}/battle`);
          }
        }
      )
      .subscribe();

    return () => {
      isMounted = false;
      void supabase.removeChannel(channel);
    };
  }, [roomId]);

  async function handleStart() {
    if (!room) return;
    setIsStarting(true);
    try {
      await startRoom(room.id, room.duration_minutes);
      router.replace(`/room/${room.id}/battle`);
    } catch {
      Alert.alert('오류', '대결 시작에 실패했습니다.');
    } finally {
      setIsStarting(false);
    }
  }

  async function handleShare() {
    if (!room) return;
    const url = Linking.createURL('room/join', { queryParams: { code: room.invite_code } });
    await Share.share({ message: `자전거 km 대결에 참여하세요!\n코드: ${room.invite_code}\n${url}` });
  }

  const isOwner = room?.owner_id === localUserId;
  const joinUrl = room
    ? Linking.createURL('room/join', { queryParams: { code: room.invite_code } })
    : '';

  return (
    <SafeAreaView className="flex-1 bg-gray-50">
      <ScrollView contentContainerStyle={{ padding: 24, gap: 24 }}>
        {room && (
          <>
            <View className="items-center gap-2">
              <Text className="text-2xl font-bold text-gray-900">{room.title}</Text>
              <RoomStatusBadge status={room.status} />
              <Text className="text-sm text-gray-500">
                {room.duration_minutes >= 1440
                  ? '하루'
                  : room.duration_minutes >= 60
                    ? `${room.duration_minutes / 60}시간`
                    : `${room.duration_minutes}분`}
                {room.goal_km ? ` • 목표 ${room.goal_km}km` : ''}
              </Text>
            </View>

            <View className="items-center gap-4">
              <View className="rounded-2xl bg-white p-4 shadow-sm">
                <QRCode value={joinUrl} size={180} />
              </View>
              <Text className="text-2xl font-bold tracking-widest text-primary">
                {room.invite_code}
              </Text>
              <Pressable onPress={handleShare} className="rounded-full bg-primary/10 px-6 py-2">
                <Text className="font-semibold text-primary">링크 공유</Text>
              </Pressable>
            </View>

            <View className="gap-3">
              <Text className="text-sm font-semibold text-gray-500">
                참여자 {participants.length}명
              </Text>
              {participants.map((p, i) => (
                <ParticipantItem
                  key={p.id}
                  participant={p}
                  rank={i + 1}
                  isCurrentUser={p.user_id === localUserId}
                />
              ))}
            </View>

            {isOwner && (
              <Button
                size="lg"
                onPress={handleStart}
                disabled={participants.length < 1 || isStarting}
              >
                <Text>대결 시작</Text>
              </Button>
            )}
          </>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}
