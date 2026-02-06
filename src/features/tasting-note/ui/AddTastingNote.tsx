import React from 'react';

import { Check } from 'lucide-react-native';
import {
  TouchableOpacity,
  Text,
  View,
  ActivityIndicator,
  Platform,
} from 'react-native';

interface AddTastingNoteProps {
  onPress: () => void;
  isLoading?: boolean;
  disabled?: boolean;
}

export default function AddTastingNote({
  onPress,
  isLoading = false,
  disabled = false,
}: AddTastingNoteProps) {
  return (
    <View className="absolute bottom-10 left-0 right-0 items-center z-50 px-6">
      <TouchableOpacity
        onPress={onPress}
        disabled={disabled || isLoading}
        activeOpacity={0.9}
        // 👇 1. 배경색은 Tailwind로 확실하게 지정 (amber-400 추천)
        className={`w-full flex-row items-center justify-center py-4 rounded-2xl ${
          disabled ? 'bg-zinc-200' : 'bg-amber-400'
        }`}
        // 👇 2. 그림자는 style로 직접 제어 (이게 제일 확실합니다)
        style={{
          ...Platform.select({
            ios: {
              shadowColor: '#fbbf24', // 아이폰: 노란 그림자
              shadowOffset: { width: 0, height: 4 },
              shadowOpacity: 0.3,
              shadowRadius: 10,
            },
            android: {
              elevation: 5, // 안드로이드: 적당한 높이
              shadowColor: '#fbbf24', // 최신 안드로이드(Pie 이상)에서는 이 색이 먹힘
            },
          }),
        }}
      >
        {isLoading ? (
          <ActivityIndicator color="#1c1917" />
        ) : (
          <>
            <Check
              size={20}
              color={disabled ? '#a1a1aa' : '#1c1917'}
              strokeWidth={3}
            />
            <Text
              className={`ml-2 text-lg font-bold ${
                disabled ? 'text-zinc-400' : 'text-[#1c1917]'
              }`}
            >
              기록 완료
            </Text>
          </>
        )}
      </TouchableOpacity>
    </View>
  );
}
