import { useState } from 'react';

import { View } from 'react-native';

import { Button } from '@/shared/ui/button';
import { Input } from '@/shared/ui/input';
import { Text } from '@/shared/ui/text';

interface JoinRoomFormProps {
  onSubmit: (code: string) => void;
  isLoading?: boolean;
}

export function JoinRoomForm({ onSubmit, isLoading }: JoinRoomFormProps) {
  const [code, setCode] = useState('');

  function handleSubmit() {
    const trimmed = code.trim().toUpperCase();
    if (trimmed.length !== 6) return;
    onSubmit(trimmed);
  }

  return (
    <View className="gap-3">
      <Input
        placeholder="초대 코드 6자리 입력"
        value={code}
        onChangeText={(v) => setCode(v.toUpperCase())}
        maxLength={6}
        autoCapitalize="characters"
        className="bg-white text-center text-xl tracking-widest"
      />
      <Button
        onPress={handleSubmit}
        disabled={code.trim().length !== 6 || isLoading}
        variant="outline"
      >
        <Text>참여하기</Text>
      </Button>
    </View>
  );
}
