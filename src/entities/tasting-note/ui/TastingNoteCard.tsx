import { Star } from 'lucide-react-native';
import { View, Text, Image, TouchableOpacity } from 'react-native';

import type { TastingNote } from '@/entities/tasting-note/model/types';

interface Props {
  note: TastingNote;
  onPress?: () => void;
}

export function TastingNoteCard({ note, onPress }: Props) {
  const date = new Date(note.createdAt).toLocaleDateString('ko-KR', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  });

  const whiskyName = note.whiskies?.nameKo || '알 수 없는 위스키';

  const thumbnail = note.imageUrls?.[0];

  return (
    <TouchableOpacity
      onPress={onPress}
      activeOpacity={0.7}
      className="bg-card rounded-2xl mb-4 overflow-hidden border border-border shadow-sm"
    >
      <View className="flex-row p-4 gap-4">
        {/* 이미지 영역 */}
        <View className="w-20 h-24 bg-muted rounded-xl overflow-hidden shrink-0">
          {thumbnail ? (
            <Image
              source={{ uri: thumbnail }}
              className="w-full h-full"
              resizeMode="cover"
            />
          ) : (
            <View className="flex-1 items-center justify-center bg-muted">
              <Text className="text-2xl">🥃</Text>
            </View>
          )}
        </View>

        {/* 텍스트 영역 */}
        <View className="flex-1 justify-between">
          <View>
            <View className="flex-row justify-between items-start">
              <Text
                className="text-lg font-bold text-foreground shrink"
                numberOfLines={1}
              >
                {whiskyName}
              </Text>

              {/* 별점 */}
              <View className="flex-row items-center bg-amber-100 dark:bg-amber-900/30 px-2 py-1 rounded-full">
                <Star size={12} fill="#fbbf24" color="#fbbf24" />
                <Text className="text-amber-700 dark:text-amber-400 font-bold text-xs ml-1">
                  {note.rating.toFixed(1)}
                </Text>
              </View>
            </View>

            <Text
              className="text-muted-foreground text-sm mt-1"
              numberOfLines={2}
            >
              {note.content}
            </Text>
          </View>

          {/* 하단 정보 */}
          <View className="flex-row justify-between items-end mt-2">
            <View className="flex-row gap-1">
              {/* nose에 있는 태그 중 앞 2개만 표시 */}
              {note.nose?.tags?.slice(0, 2).map((tag, i) => (
                <Text
                  key={i}
                  className="text-[10px] bg-muted px-1.5 py-0.5 rounded text-muted-foreground"
                >
                  #{tag}
                </Text>
              ))}
            </View>
            <Text className="text-xs text-muted-foreground">{date}</Text>
          </View>
        </View>
      </View>
    </TouchableOpacity>
  );
}
