import React, { useState } from 'react';

import { Stack } from 'expo-router';
import { View, ScrollView, KeyboardAvoidingView, Platform } from 'react-native';

import AddTastingNote from '@/features/tasting-note/ui/AddTastingNote';
import { AddWhiskyPhoto } from '@/features/tasting-note/ui/AddWhiskyPhoto';
import { FlavorSection } from '@/features/tasting-note/ui/FlavorSection';
import { SimpleNoteInput } from '@/features/tasting-note/ui/SimpleNoteInput';

import type { TastingNote } from '@/entities/tasting-note/model/tastingNote';

export default function WriteScreen() {
  const [content, setContent] = useState('');
  const [imageUri, setImageUri] = useState<string | null>(null);

  const [noseMemo, setNoseMemo] = useState('');
  const [palateMemo, setPalateMemo] = useState('');
  const [finishMemo, setFinishMemo] = useState('');

  const handleSave = () => {
    const noteData: TastingNote = {
      id: new Date().toISOString(),
      imageUrls: imageUri ? [imageUri] : null,
      content,
      nose: {
        memo: noseMemo,
      },
      palate: {
        memo: palateMemo,
      },
      finish: {
        memo: finishMemo,
      },
    };

    console.log('저장 데이터:', noteData);
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      className="flex-1 bg-background"
    >
      <Stack.Screen
        options={{
          title: '노트 작성',
        }}
      />
      <ScrollView
        className="flex-1 p-6"
        contentContainerStyle={{ paddingBottom: 100 }}
      >
        <AddWhiskyPhoto imageUri={imageUri} onImageSelect={setImageUri} />
        <SimpleNoteInput value={content} onChangeText={setContent} />
        <View className="h-[1px] bg-border my-6 opacity-50" />
        <FlavorSection
          label="👃 Nose (향)"
          memo={noseMemo}
          onMemoChange={setNoseMemo}
        />
        <FlavorSection
          label="👅 Palate (맛)"
          memo={palateMemo}
          onMemoChange={setPalateMemo}
        />
        <FlavorSection
          label="🏁 Finish (여운)"
          memo={finishMemo}
          onMemoChange={setFinishMemo}
        />
        <AddTastingNote
          onPress={handleSave}
          disabled={false}
          isLoading={false}
        />
      </ScrollView>
    </KeyboardAvoidingView>
  );
}
