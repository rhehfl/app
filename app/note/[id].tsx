import React from 'react';

import { useLocalSearchParams, Stack } from 'expo-router';
import { Share as ShareIcon } from 'lucide-react-native';
import {
  View,
  Text,
  ScrollView,
  Image,
  TouchableOpacity,
  Share,
  useColorScheme,
} from 'react-native';

import type { TastingNote } from '@/entities/tasting-note/model/tastingNote';

// --- 임시 더미 데이터 (테스트용) ---
const MOCK_DATA: TastingNote[] = [
  {
    id: '1',
    content: '전반적으로 밸런스가 아주 훌륭하다. 셰리 피트의 정석.',
    imageUri:
      'https://images.unsplash.com/photo-1527281400683-1aed5705f541?q=80&w=800&auto=format&fit=crop',
    nose: { memo: '건포도, 시나몬, 약간의 생강 향' },
    palate: { memo: '부드러운 목넘김, 오렌지 제스트, 스파이시' },
    finish: { memo: '길게 남는 오크 향과 달콤함' },
    // 아래 필드들은 UI 표시를 위해 임의로 추가한 타입이라 가정합니다.
    // 실제 데이터 구조에 맞게 수정해주세요.
    name: 'Macallan 18 Sherry Oak',
    date: '2023.10.15',
  },
];

// --- 작은 섹션 컴포넌트 ---
const NoteSection = ({
  title,
  icon,
  content,
}: {
  title: string;
  icon: string;
  content?: string | null;
}) => (
  <View className="p-4 mb-3 rounded-xl bg-amber-50 dark:bg-stone-900 border border-amber-100 dark:border-stone-800">
    <View className="flex-row items-center mb-2">
      <Text className="text-lg mr-2">{icon}</Text>
      <Text className="text-xs font-extrabold tracking-widest text-amber-600 dark:text-amber-500 uppercase">
        {title}
      </Text>
    </View>
    <Text className="text-base text-stone-800 dark:text-stone-300 leading-6">
      {content || '기록 없음'}
    </Text>
  </View>
);

export default function NoteDetailScreen() {
  const { id } = useLocalSearchParams();
  const isDark = useColorScheme() === 'dark';

  // --- 리액트 쿼리 사용 시 아래 주석 해제 및 수정 ---
  // const { data: note } = useSuspenseQuery(tastingNoteKeys.detail(String(id)));

  // 현재는 임시로 더미 데이터에서 검색
  const note = MOCK_DATA.find((n) => n.id === id);

  // 데이터가 없을 때 처리
  if (!note) {
    return (
      <View className="flex-1 items-center justify-center bg-stone-50 dark:bg-stone-950">
        <Text className="text-stone-500">노트를 찾을 수 없습니다.</Text>
      </View>
    );
  }

  // 공유 기능
  const handleShare = async () => {
    try {
      await Share.share({
        message: `[Whisky Log] ${note.name || '위스키'}\n\n${note.content}`,
      });
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <View className="flex-1 bg-stone-50 dark:bg-stone-950">
      {/* Stack.Screen을 사용하여 헤더 스타일링 
        - headerStyle: 배경색
        - headerTintColor: 뒤로가기 버튼 및 타이틀 색상
        - headerRight: 공유 버튼 추가
      */}
      <Stack.Screen
        options={{
          headerTitle: '', // 타이틀 비워둠 (깔끔하게)
          headerBackTitle: '목록',
          headerStyle: {
            backgroundColor: isDark ? '#0c0a09' : '#fafaf9', // stone-950 / stone-50
          },
          headerTintColor: '#d97706', // amber-600 (위스키색)
          headerShadowVisible: false, // 헤더 하단 라인 제거
          headerRight: () => (
            <TouchableOpacity onPress={handleShare} className="p-2">
              <ShareIcon size={20} color="#d97706" />
            </TouchableOpacity>
          ),
        }}
      />

      <ScrollView contentContainerStyle={{ paddingBottom: 40 }}>
        {/* 이미지 영역 */}
        <View className="w-full h-96 bg-stone-200 dark:bg-stone-900 mb-6">
          {note.imageUri ? (
            <Image
              source={{ uri: note.imageUri }}
              className="w-full h-full"
              resizeMode="cover"
            />
          ) : (
            <View className="w-full h-full items-center justify-center border-b border-amber-500/10">
              <Text className="text-6xl opacity-50">🥃</Text>
            </View>
          )}
        </View>

        {/* 타이틀 정보 */}
        <View className="px-6 mb-8">
          <Text className="text-3xl font-extrabold text-stone-900 dark:text-stone-50 mb-2 tracking-tighter leading-tight">
            {note.name || '이름 없는 위스키'}
          </Text>
          <Text className="text-sm font-medium text-stone-500 dark:text-stone-400">
            {note.date || '날짜 미상'}
          </Text>
        </View>

        {/* 구분선 */}
        <View className="h-[1px] w-[90%] self-center bg-amber-900/10 dark:bg-white/10 mb-8" />

        {/* 테이스팅 노트 섹션 */}
        <View className="px-5 mb-6 gap-y-2">
          <NoteSection title="Nose" icon="👃" content={note.nose?.memo} />
          <NoteSection title="Palate" icon="👅" content={note.palate?.memo} />
          <NoteSection title="Finish" icon="🏁" content={note.finish?.memo} />
        </View>

        {/* 총평 */}
        <View className="mx-5 mt-4 p-6 border border-dashed border-stone-300 dark:border-stone-700 rounded-2xl bg-white dark:bg-stone-900/50">
          <Text className="text-sm font-bold text-stone-400 dark:text-stone-500 mb-3 uppercase tracking-wider">
            Review
          </Text>
          <Text className="text-lg text-stone-800 dark:text-stone-200 leading-7 font-medium">
            {note.content}
          </Text>
        </View>
      </ScrollView>
    </View>
  );
}
