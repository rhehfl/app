import { View } from 'react-native';

import { Text } from '@/shared/ui/text';

import type { Participant } from '../model/types';

interface ParticipantItemProps {
  participant: Participant;
  rank: number;
  isCurrentUser?: boolean;
}

export function ParticipantItem({ participant, rank, isCurrentUser }: ParticipantItemProps) {
  const isFirst = rank === 1;
  return (
    <View
      className={`flex-row items-center justify-between rounded-xl px-4 py-3 ${
        isCurrentUser ? 'border border-primary bg-primary/5' : 'bg-white'
      }`}
      style={{ elevation: 2, shadowColor: '#000', shadowOpacity: 0.06, shadowRadius: 4 }}
    >
      <View className="flex-row items-center gap-3">
        <Text className={`w-7 text-center text-lg ${isFirst ? 'text-yellow-500' : 'text-gray-400'} font-bold`}>
          {isFirst ? '🥇' : rank}
        </Text>
        <Text className={`text-base ${isCurrentUser ? 'font-bold text-primary' : 'font-medium text-gray-800'}`}>
          {participant.users?.nickname ?? '익명'}
          {isCurrentUser ? ' (나)' : ''}
        </Text>
      </View>
      <Text className="text-base font-semibold text-gray-700">
        {participant.total_km.toFixed(2)} km
      </Text>
    </View>
  );
}
