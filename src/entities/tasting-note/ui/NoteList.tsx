import { useCallback, useState } from 'react';

import { useFocusEffect, router } from 'expo-router';
import { PenSquare } from 'lucide-react-native';
import {
  FlatList,
  View,
  Text,
  TouchableOpacity,
  ActivityIndicator,
  RefreshControl,
} from 'react-native';

import type { TastingNote } from '@/entities/tasting-note';
import { getTastingNotes } from '@/entities/tasting-note/api/getNotes';
import { TastingNoteCard } from '@/entities/tasting-note/ui/TastingNoteCard';

export function NoteList() {
  const [notes, setNotes] = useState<TastingNote[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const fetchData = async () => {
    try {
      const data = await getTastingNotes();
      setNotes(data);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useFocusEffect(
    useCallback(() => {
      fetchData();
    }, []),
  );

  const onRefresh = () => {
    setRefreshing(true);
    fetchData();
  };

  if (loading) {
    return (
      <View className="flex-1 justify-center items-center py-20">
        <ActivityIndicator size="large" color="#fbbf24" />
      </View>
    );
  }

  if (!notes || notes.length === 0) {
    return (
      <View className="flex-1 items-center justify-center py-20 px-4">
        <View className="w-20 h-20 bg-muted rounded-full items-center justify-center mb-6">
          <PenSquare size={40} className="text-muted-foreground opacity-50" />
        </View>
        <Text className="text-xl font-bold text-foreground mb-2">
          아직 기록이 없어요
        </Text>
        <Text className="text-muted-foreground text-center mb-8">
          오늘 마신 위스키의 맛과 향을{'\n'}첫 번째 기록으로 남겨보세요!
        </Text>
        <TouchableOpacity
          onPress={() => router.push('/(tabs)/write')}
          className="bg-primary px-6 py-3 rounded-full"
        >
          <Text className="text-primary-foreground font-bold">
            첫 기록 남기기
          </Text>
        </TouchableOpacity>
      </View>
    );
  }

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
          refreshing={refreshing}
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
