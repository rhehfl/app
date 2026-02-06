import React from 'react';

import { View, Text, TextInput } from 'react-native';

interface SimpleNoteInputProps {
  value: string;
  onChangeText: (text: string) => void;
}

export function SimpleNoteInput({ value, onChangeText }: SimpleNoteInputProps) {
  return (
    <View className="mb-8">
      <Text className="text-lg font-bold text-foreground mb-3 px-1">
        📝 한줄 평 & 감정
      </Text>

      <View className="bg-card rounded-2xl border border-border shadow-sm overflow-hidden">
        <TextInput
          value={value}
          onChangeText={onChangeText}
          multiline
          placeholder="오늘 마신 위스키는 어땠나요?&#13;&#10;기분, 분위기, 총평을 자유롭게 적어주세요."
          placeholderTextColor="#a1a1aa"
          className="p-4 text-foreground text-base leading-6 min-h-[120px]"
          style={{ textAlignVertical: 'top' }}
        />
      </View>

      <View className="flex-row justify-end mt-2 px-1">
        <Text className="text-xs text-muted-foreground">
          {value.length}자 기록됨
        </Text>
      </View>
    </View>
  );
}
