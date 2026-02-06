import React from 'react';

import { View, Text, TouchableOpacity, Image } from 'react-native';

import type { TastingNote } from '@/entities/tasting-note/model/tastingNote';

interface NoteItemProps {
  item: TastingNote;
  onPress: () => void;
}

export default function NoteItem({ item, onPress }: NoteItemProps) {
  return (
    <TouchableOpacity
      onPress={onPress}
      activeOpacity={0.9}
      className="flex-row p-4 mb-4 bg-white dark:bg-stone-800 rounded-2xl border border-stone-200 dark:border-stone-700 shadow-sm"
    >
      {/* 썸네일 */}
      <View className="w-16 h-16 mr-4 rounded-xl overflow-hidden bg-whisky-light dark:bg-whisky-bg items-center justify-center">
        {item.imageUri ? (
          <Image
            source={{ uri: item.imageUri }}
            className="w-full h-full"
            resizeMode="cover"
          />
        ) : (
          <Text className="text-xl">🥃</Text>
        )}
      </View>

      {/* 내용 */}
      <View className="flex-1 justify-center">
        <View className="flex-row justify-between items-center mb-1">
          <Text
            className="text-lg font-bold text-stone-900 dark:text-stone-100 flex-1 mr-2"
            numberOfLines={1}
          >
            {item.name}
          </Text>
          <Text className="text-xs text-stone-500 dark:text-stone-400">
            {item.date}
          </Text>
        </View>

        <Text
          className="text-sm text-stone-600 dark:text-stone-300 leading-5 mb-2"
          numberOfLines={2}
        >
          {item.content}
        </Text>

        {/* 태그 (뱃지) */}
        <View className="flex-row gap-2">
          {item.nose?.memo && (
            <View className="px-2 py-0.5 bg-whisky-light dark:bg-stone-700 rounded-md">
              <Text className="text-[10px] font-bold text-whisky dark:text-whisky">
                Nose
              </Text>
            </View>
          )}
          {item.finish?.memo && (
            <View className="px-2 py-0.5 bg-whisky-light dark:bg-stone-700 rounded-md">
              <Text className="text-[10px] font-bold text-whisky dark:text-whisky">
                Finish
              </Text>
            </View>
          )}
        </View>
      </View>
    </TouchableOpacity>
  );
}
