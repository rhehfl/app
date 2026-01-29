import React, { useState } from 'react';

import { Plus, X } from 'lucide-react-native';
import { View, Text, TouchableOpacity, TextInput } from 'react-native';

import type { FlavorTag } from '@/features/tasting-note/types';
import { FlavorAddModal } from '@/features/tasting-note/ui/FlavorAddModal';

interface FlavorSectionProps {
  label: string;
  items: FlavorTag[];
  onItemsChange: (newItems: FlavorTag[]) => void;
  color: string;
  // 👇 [추가] 텍스트 메모를 위한 Props
  memo: string;
  onMemoChange: (text: string) => void;
}

export function FlavorSection({
  label,
  items,
  onItemsChange,
  color,
  memo,
  onMemoChange,
}: FlavorSectionProps) {
  const [modalVisible, setModalVisible] = useState(false);

  const handleAddFlavor = (name: string, score: number) => {
    const newItem: FlavorTag = {
      id: Date.now().toString(),
      name,
      score,
    };
    onItemsChange([...items, newItem]);
  };

  const handleDelete = (id: string) => {
    onItemsChange(items.filter((item) => item.id !== id));
  };

  return (
    <View className="mb-8">
      {/* 1. 헤더 */}
      <View className="flex-row justify-between items-center mb-3 px-1">
        <Text className="text-lg font-bold text-foreground">{label}</Text>
        <TouchableOpacity
          onPress={() => setModalVisible(true)}
          className="flex-row items-center bg-muted/50 px-3 py-1.5 rounded-full border border-border/50"
        >
          <Plus size={16} color={color} strokeWidth={3} />
          <Text className="text-xs font-bold ml-1 text-foreground opacity-80">
            추가
          </Text>
        </TouchableOpacity>
      </View>

      {/* 2. 태그 리스트 */}
      <View className="flex-row flex-wrap gap-2 mb-3">
        {items.map((item) => (
          <View
            key={item.id}
            className="flex-row items-center bg-card pl-3 pr-2 py-2 rounded-xl border border-border shadow-sm"
          >
            <Text className="text-sm font-medium text-foreground mr-2">
              {item.name}
            </Text>
            <View
              className="px-1.5 py-0.5 rounded-md mr-2"
              style={{ backgroundColor: color }}
            >
              <Text className="text-[10px] font-bold text-white">
                {item.score}
              </Text>
            </View>
            <TouchableOpacity onPress={() => handleDelete(item.id)} hitSlop={5}>
              <X size={14} className="text-muted-foreground opacity-50" />
            </TouchableOpacity>
          </View>
        ))}

        {items.length === 0 && (
          <TouchableOpacity
            onPress={() => setModalVisible(true)}
            className="w-full py-4 items-center justify-center border-2 border-dashed border-muted rounded-2xl bg-muted/5 mb-1"
          >
            <Text className="text-muted-foreground text-xs">
              + 태그 추가 (예: 바닐라, 스모키)
            </Text>
          </TouchableOpacity>
        )}
      </View>

      {/* 3. [NEW] 섹션별 상세 코멘트 입력창 */}
      <View className="bg-card rounded-xl border border-border/60">
        <TextInput
          value={memo}
          onChangeText={onMemoChange}
          placeholder={`${label}에 대한 구체적인 느낌을 적어보세요...`}
          placeholderTextColor="#a1a1aa"
          multiline
          className="p-3 text-sm text-foreground min-h-[60px] leading-5"
          style={{ textAlignVertical: 'top' }}
        />
      </View>

      {/* 모달 */}
      <FlavorAddModal
        visible={modalVisible}
        onClose={() => setModalVisible(false)}
        onSave={handleAddFlavor}
        categoryName={label}
        color={color}
      />
    </View>
  );
}
