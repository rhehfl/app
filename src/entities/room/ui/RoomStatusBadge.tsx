import { View } from 'react-native';

import { Text } from '@/shared/ui/text';

import type { RoomStatus } from '../model/types';

const statusConfig: Record<RoomStatus, { label: string; bg: string; text: string }> = {
  waiting: { label: '대기중', bg: 'bg-yellow-100', text: 'text-yellow-700' },
  active: { label: '진행중', bg: 'bg-green-100', text: 'text-green-700' },
  finished: { label: '종료', bg: 'bg-gray-100', text: 'text-gray-600' },
};

interface RoomStatusBadgeProps {
  status: RoomStatus;
}

export function RoomStatusBadge({ status }: RoomStatusBadgeProps) {
  const { label, bg, text } = statusConfig[status];
  return (
    <View className={`rounded-full px-3 py-1 ${bg}`}>
      <Text className={`text-xs font-semibold ${text}`}>{label}</Text>
    </View>
  );
}
