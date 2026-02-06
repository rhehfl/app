import React, { useState } from 'react';

import { useHeaderHeight } from '@react-navigation/elements';
import { useMutation } from '@tanstack/react-query';
import { Stack } from 'expo-router';
import {
  View,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  TouchableWithoutFeedback,
  Keyboard,
} from 'react-native';

import AddTastingNote from '@/features/tasting-note/ui/AddTastingNote';
import { AddWhiskyPhoto } from '@/features/tasting-note/ui/AddWhiskyPhoto';
import { FlavorSection } from '@/features/tasting-note/ui/FlavorSection';
import { SimpleNoteInput } from '@/features/tasting-note/ui/SimpleNoteInput';

import type { TastingNote } from '@/entities/tasting-note/model/tastingNote';
import { tastingNoteMutationOptions } from '@/entities/tasting-note/queries/mutationOptions';

import { useKeyboardOffset } from '@/shared/hooks/useKeyboardOffset';
import { Input } from '@/shared/ui/input';
import { Label } from '@/shared/ui/label';

export default function CreateTastingNoteForm() {
  const [content, setContent] = useState('');
  const [imageUri, setImageUri] = useState<string | null>(null);
  const [noseMemo, setNoseMemo] = useState('');
  const [palateMemo, setPalateMemo] = useState('');
  const [finishMemo, setFinishMemo] = useState('');
  const [whiskyName, setWhiskyName] = useState('');
  const [noteDate, setNoteDate] = useState('');
  const { keyboardHeight } = useKeyboardOffset();
  const headerHeight = useHeaderHeight();
  const { mutate } = useMutation(tastingNoteMutationOptions.add());

  const handleAddTastingNote = () => {
    const newTastingNote: TastingNote = {
      id: Date.now().toString(),
      name: whiskyName.trim(),
      date: noteDate.trim(),
      content,
      imageUri,
      nose: { memo: noseMemo },
      palate: { memo: palateMemo },
      finish: { memo: finishMemo },
    };
    mutate(newTastingNote);
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      keyboardVerticalOffset={Platform.OS === 'ios' ? headerHeight : 0}
      className="flex-1 bg-background"
    >
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <View className="flex-1">
          <ScrollView
            className="flex-1"
            contentContainerStyle={{
              flexGrow: 1,
              padding: 24,
              paddingBottom: keyboardHeight > 0 ? keyboardHeight - 50 : 100,
            }}
            keyboardShouldPersistTaps="handled"
          >
            <Stack.Screen options={{ title: '노트 작성' }} />

            <View className="gap-2 mb-4">
              <Label>위스키 이름</Label>
              <Input
                placeholder="위스키 이름을 입력하세요"
                value={whiskyName}
                onChangeText={setWhiskyName}
                autoCapitalize="words"
              />
            </View>

            <View className="gap-2 mb-6">
              <Label>시음 날짜</Label>
              <Input
                placeholder="YYYY-MM-DD"
                value={noteDate}
                onChangeText={setNoteDate}
                keyboardType="numbers-and-punctuation"
                autoCapitalize="none"
              />
            </View>

            <AddWhiskyPhoto imageUri={imageUri} onImageSelect={setImageUri} />
            <SimpleNoteInput value={content} onChangeText={setContent} />

            <View className="h-[1px] my-6 opacity-50 bg-border" />

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
              onPress={handleAddTastingNote}
              disabled={false}
              isLoading={false}
            />

            {Platform.OS === 'android' && (
              <View style={{ height: keyboardHeight }} />
            )}
          </ScrollView>
        </View>
      </TouchableWithoutFeedback>
    </KeyboardAvoidingView>
  );
}
