import React, { useState } from 'react';

import { Stack } from 'expo-router';
import {
  View,
  ScrollView,
  TouchableOpacity,
  Text,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';

import type { FlavorTag } from '@/features/tasting-note';
import {
  AddWhiskyPhoto,
  SimpleNoteInput,
  FlavorSection,
} from '@/features/tasting-note';

export default function WriteScreen() {
  const [content, setContent] = useState('');
  const [imageUri, setImageUri] = useState<string | null>(null);

  const [noseItems, setNoseItems] = useState<FlavorTag[]>([]);
  const [palateItems, setPalateItems] = useState<FlavorTag[]>([]);
  const [finishItems, setFinishItems] = useState<FlavorTag[]>([]);

  const [noseMemo, setNoseMemo] = useState('');
  const [palateMemo, setPalateMemo] = useState('');
  const [finishMemo, setFinishMemo] = useState('');

  const handleSave = () => {
    const noteData = {
      imageUri,
      globalContent: content,
      nose: {
        tags: noseItems,
        memo: noseMemo,
      },
      palate: {
        tags: palateItems,
        memo: palateMemo,
      },
      finish: {
        tags: finishItems,
        memo: finishMemo,
      },
    };

    console.log('저장 데이터:', noteData);
    // TODO: supabase insert logic...
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      className="flex-1 bg-background"
    >
      <Stack.Screen
        options={{
          title: '노트 작성',
          headerRight: () => (
            <TouchableOpacity onPress={handleSave}>
              <Text className="text-primary font-bold text-lg">저장</Text>
            </TouchableOpacity>
          ),
        }}
      />

      <ScrollView
        className="flex-1 p-6"
        contentContainerStyle={{ paddingBottom: 100 }}
      >
        <AddWhiskyPhoto imageUri={imageUri} onImageSelect={setImageUri} />

        {/* 전체 총평 (가장 중요한 감상) */}
        <SimpleNoteInput value={content} onChangeText={setContent} />

        <View className="h-[1px] bg-border my-6 opacity-50" />

        {/* 👃 Nose */}
        <FlavorSection
          label="👃 Nose (향)"
          items={noseItems}
          onItemsChange={setNoseItems}
          memo={noseMemo}
          onMemoChange={setNoseMemo}
          color="#fbbf24"
        />

        {/* 👅 Palate */}
        <FlavorSection
          label="👅 Palate (맛)"
          items={palateItems}
          onItemsChange={setPalateItems}
          memo={palateMemo}
          onMemoChange={setPalateMemo}
          color="#f87171"
        />

        {/* 🏁 Finish */}
        <FlavorSection
          label="🏁 Finish (여운)"
          items={finishItems}
          onItemsChange={setFinishItems}
          memo={finishMemo}
          onMemoChange={setFinishMemo}
          color="#60a5fa"
        />
      </ScrollView>
    </KeyboardAvoidingView>
  );
}
