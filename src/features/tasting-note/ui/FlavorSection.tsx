import React, { useState } from 'react';

import { View, Text, TextInput } from 'react-native';

interface FlavorSectionProps {
  label: string;
  memo: string;
  onMemoChange: (text: string) => void;
}

export function FlavorSection({
  label,
  memo,
  onMemoChange,
}: FlavorSectionProps) {
  const [memoHeight, setMemoHeight] = useState(60);

  return (
    <View className="mb-8">
      <View className="flex-row justify-between items-center mb-3 px-1">
        <Text className="text-lg font-bold text-foreground">{label}</Text>
      </View>
      <View className="bg-card rounded-xl border border-border/60">
        <TextInput
          value={memo}
          onChangeText={onMemoChange}
          placeholder={`${label}에 대한 구체적인 느낌을 적어보세요...`}
          placeholderTextColor="#a1a1aa"
          onContentSizeChange={(event) => {
            setMemoHeight(event.nativeEvent.contentSize.height);
          }}
          multiline
          className="p-3 text-sm text-foreground leading-5"
          style={{
            minHeight: 60,
            height: Math.max(60, memoHeight),
          }}
        />
      </View>
    </View>
  );
}
