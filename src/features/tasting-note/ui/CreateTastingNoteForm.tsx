import React, { useState, useRef } from 'react';

import { useHeaderHeight } from '@react-navigation/elements';
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

import { useKeyboardOffset } from '@/shared/hooks/useKeyboardOffset';

export default function CreateTastingNoteForm() {
  const [content, setContent] = useState('');
  const [imageUri, setImageUri] = useState<string | null>(null);
  const [noseMemo, setNoseMemo] = useState('');
  const [palateMemo, setPalateMemo] = useState('');
  const [finishMemo, setFinishMemo] = useState('');
  const { keyboardHeight } = useKeyboardOffset();
  const headerHeight = useHeaderHeight();
  const scrollRef = useRef<ScrollView>(null);

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      keyboardVerticalOffset={Platform.OS === 'ios' ? headerHeight : 0}
      className="flex-1 bg-background"
    >
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <View className="flex-1">
          <ScrollView
            ref={scrollRef}
            className="flex-1"
            contentContainerStyle={{
              flexGrow: 1,
              padding: 24,
              paddingBottom: keyboardHeight > 0 ? keyboardHeight - 50 : 100,
            }}
            keyboardShouldPersistTaps="handled"
          >
            <Stack.Screen options={{ title: '노트 작성' }} />

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

            {/* 3. 하단 입력창일수록 키보드에 가려지기 쉬우므로 onFocus 처리 제안 */}
            <FlavorSection
              label="🏁 Finish (여운)"
              memo={finishMemo}
              onMemoChange={setFinishMemo}
            />

            <AddTastingNote
              onPress={() => {}}
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
