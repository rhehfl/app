import React from 'react';

import { Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { CreateNoteButton } from '@/features/tasting-note/ui/CreateNoteButton';

export default function HomeScreen() {
  return (
    <SafeAreaView className="flex-1 bg-background">
      <View className="px-6 pt-6 pb-2">
        <Text className="text-3xl font-extrabold text-foreground mt-1">
          나의 테이스팅 노트
        </Text>
      </View>
      <CreateNoteButton />
    </SafeAreaView>
  );
}
