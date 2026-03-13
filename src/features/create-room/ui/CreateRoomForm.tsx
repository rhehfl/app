import { useState } from 'react';

import { Pressable, ScrollView, View } from 'react-native';

import { Button } from '@/shared/ui/button';
import { Input } from '@/shared/ui/input';
import { Text } from '@/shared/ui/text';

export interface CreateRoomFormValues {
  title: string;
  duration_minutes: number;
  goal_km: number | null;
}

interface CreateRoomFormProps {
  onSubmit: (values: CreateRoomFormValues) => void;
  isLoading?: boolean;
}

const DURATION_OPTIONS = [
  { label: '30분', value: 30 },
  { label: '1시간', value: 60 },
  { label: '3시간', value: 180 },
  { label: '하루', value: 1440 },
];

export function CreateRoomForm({ onSubmit, isLoading }: CreateRoomFormProps) {
  const [title, setTitle] = useState('');
  const [durationMinutes, setDurationMinutes] = useState(60);
  const [goalKmText, setGoalKmText] = useState('');

  function handleSubmit() {
    if (!title.trim()) return;
    const goal_km = goalKmText ? parseFloat(goalKmText) : null;
    onSubmit({ title: title.trim(), duration_minutes: durationMinutes, goal_km });
  }

  return (
    <ScrollView className="flex-1 bg-gray-50" contentContainerStyle={{ padding: 24 }}>
      <View className="gap-6">
        <View className="gap-2">
          <Text className="text-sm font-semibold text-gray-700">방 이름</Text>
          <Input
            placeholder="ex) 한강 라이딩 대결"
            value={title}
            onChangeText={setTitle}
            className="bg-white"
          />
        </View>

        <View className="gap-2">
          <Text className="text-sm font-semibold text-gray-700">대결 시간</Text>
          <View className="flex-row flex-wrap gap-2">
            {DURATION_OPTIONS.map((opt) => (
              <Pressable
                key={opt.value}
                onPress={() => setDurationMinutes(opt.value)}
                className={`rounded-full px-5 py-2.5 ${
                  durationMinutes === opt.value
                    ? 'bg-primary'
                    : 'border border-gray-200 bg-white'
                }`}
              >
                <Text
                  className={`font-medium ${
                    durationMinutes === opt.value ? 'text-white' : 'text-gray-700'
                  }`}
                >
                  {opt.label}
                </Text>
              </Pressable>
            ))}
          </View>
        </View>

        <View className="gap-2">
          <Text className="text-sm font-semibold text-gray-700">
            목표 km <Text className="text-xs text-gray-400">(선택)</Text>
          </Text>
          <Input
            placeholder="ex) 50"
            value={goalKmText}
            onChangeText={setGoalKmText}
            keyboardType="numeric"
            className="bg-white"
          />
        </View>

        <Button onPress={handleSubmit} disabled={!title.trim() || isLoading} size="lg">
          <Text>방 만들기</Text>
        </Button>
      </View>
    </ScrollView>
  );
}
