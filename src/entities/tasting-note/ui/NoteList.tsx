import { useCallback } from 'react';

import { useSuspenseQuery } from '@tanstack/react-query';
import { useFocusEffect } from 'expo-router';
import { PenSquare } from 'lucide-react-native';
import {
  FlatList,
  View,
  Text,
  TouchableOpacity,
  RefreshControl,
} from 'react-native';

import { tastingNoteKeys } from '@/entities/tasting-note/queries/queryKey';
import { TastingNoteCard } from '@/entities/tasting-note/ui/TastingNoteCard';

export function NoteList() {
  const {
    data: notes,
    refetch,
    isRefetching,
  } = useSuspenseQuery(tastingNoteKeys.list());
  useFocusEffect(
    useCallback(() => {
      refetch();
    }, [refetch]),
  );

  const onRefresh = async () => {
    await refetch();
  };

  // 2. 데이터 없음 (Empty State)
  if (!notes || notes.length === 0) {
    return (
      <View className="flex-1 items-center justify-center py-20 px-4">
        {/* ... (기존 Empty UI 코드 동일) ... */}
        <View className="w-20 h-20 bg-muted rounded-full items-center justify-center mb-6">
          <PenSquare size={40} className="text-muted-foreground opacity-50" />
        </View>
        <Text className="text-xl font-bold text-foreground mb-2">
          아직 기록이 없어요
        </Text>
        <Text className="text-muted-foreground text-center mb-8">
          오늘 마신 위스키의 맛과 향을{'\n'}첫 번째 기록으로 남겨보세요!
        </Text>
        <TouchableOpacity className="bg-primary px-6 py-3 rounded-full">
          <Text className="text-primary-foreground font-bold">
            첫 기록 남기기
          </Text>
        </TouchableOpacity>
      </View>
    );
  }

  // 3. 리스트 출력
  return (
    <FlatList
      data={notes}
      keyExtractor={(item) => item.id}
      renderItem={({ item }) => (
        <TastingNoteCard
          note={item}
          onPress={() => console.log('상세:', item.id)}
        />
      )}
      contentContainerClassName="p-6 pb-32"
      showsVerticalScrollIndicator={false}
      refreshControl={
        <RefreshControl
          refreshing={isRefetching} // 👈 리액트 쿼리가 제공하는 상태 사용
          onRefresh={onRefresh}
          tintColor="#fbbf24"
        />
      }
      ListHeaderComponent={
        <View className="mb-4">
          <Text className="text-foreground text-sm opacity-50">
            Total {notes.length} notes
          </Text>
        </View>
      }
    />
  );
}
