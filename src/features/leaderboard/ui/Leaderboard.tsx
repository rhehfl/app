import { useEffect } from 'react';

import { useQueryClient, useSuspenseQuery } from '@tanstack/react-query';
import { FlatList, View } from 'react-native';

import { participantsQueryOptions } from '@/entities/participant/queries';
import { ParticipantItem } from '@/entities/participant/ui';

import { supabase } from '@/shared/lib/supabase';
import { Text } from '@/shared/ui/text';


interface LeaderboardProps {
  roomId: string;
  currentUserId: string;
}

export function Leaderboard({ roomId, currentUserId }: LeaderboardProps) {
  const queryClient = useQueryClient();
  const { data: participants } = useSuspenseQuery(participantsQueryOptions(roomId));

  useEffect(() => {
    const channel = supabase
      .channel(`participants:${roomId}`)
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'participants', filter: `room_id=eq.${roomId}` },
        () => {
          void queryClient.invalidateQueries({ queryKey: ['participants', roomId] });
        }
      )
      .subscribe();

    return () => {
      void supabase.removeChannel(channel);
    };
  }, [roomId, queryClient]);

  if (participants.length === 0) {
    return (
      <View className="items-center py-8">
        <Text className="text-gray-400">아직 참여자가 없습니다</Text>
      </View>
    );
  }

  return (
    <FlatList
      data={participants}
      keyExtractor={(item) => item.id}
      contentContainerStyle={{ gap: 8 }}
      renderItem={({ item, index }) => (
        <ParticipantItem
          participant={item}
          rank={index + 1}
          isCurrentUser={item.user_id === currentUserId}
        />
      )}
    />
  );
}
