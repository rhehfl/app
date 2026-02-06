import {
  View,
  Text,
  TouchableOpacity,
  Image,
  Modal,
  ScrollView,
  Share,
} from 'react-native';

import type { TastingNote } from '@/entities/tasting-note/model/tastingNote';

interface NoteDetailProps {
  note: TastingNote;
  onClose: () => void;
}

export const NoteDetail = ({ note, onClose }: NoteDetailProps) => {
  const handleShare = async () => {
    try {
      await Share.share({
        message: `[Whisky Note] ${note.name}\n\nNose: ${note.nose?.memo}\nPalate: ${note.palate?.memo}\n\n${note.content}`,
      });
    } catch (error) {
      console.error(error);
    }
  };

  const Section = ({
    title,
    icon,
    content,
  }: {
    title: string;
    icon: string;
    content?: string | null;
  }) => (
    <View className="p-4 mb-3 rounded-xl bg-amber-50/50 dark:bg-stone-800/50">
      <View className="flex-row items-center mb-2">
        <Text className="text-lg mr-2">{icon}</Text>
        <Text className="text-xs font-extrabold tracking-widest text-whisky uppercase">
          {title}
        </Text>
      </View>
      <Text className="text-base text-stone-800 dark:text-stone-200 leading-6">
        {content || '기록 없음'}
      </Text>
    </View>
  );

  return (
    <Modal
      animationType="slide"
      presentationStyle="pageSheet"
      visible={true}
      onRequestClose={onClose}
    >
      <View className="flex-1 bg-stone-50 dark:bg-stone-900">
        {/* 헤더 */}
        <View className="h-14 flex-row items-center justify-between px-4 border-b border-stone-200 dark:border-stone-800">
          <TouchableOpacity onPress={onClose} className="p-2">
            <Text className="text-base text-stone-500 dark:text-stone-400">
              닫기
            </Text>
          </TouchableOpacity>
          <Text className="text-lg font-semibold text-stone-900 dark:text-stone-100">
            Tasting Note
          </Text>
          <TouchableOpacity onPress={handleShare} className="p-2">
            <Text className="text-base font-bold text-whisky">공유</Text>
          </TouchableOpacity>
        </View>

        <ScrollView contentContainerStyle={{ paddingBottom: 40 }}>
          {/* 이미지 영역 */}
          <View className="w-full h-80 mb-6 bg-stone-200 dark:bg-stone-800">
            {note.imageUri ? (
              <Image
                source={{ uri: note.imageUri }}
                className="w-full h-full"
                resizeMode="cover"
              />
            ) : (
              <View className="w-full h-full items-center justify-center border-b border-whisky/20">
                <Text className="text-6xl">🥃</Text>
              </View>
            )}
          </View>

          {/* 타이틀 정보 */}
          <View className="px-6 mb-6">
            <Text className="text-3xl font-extrabold text-stone-900 dark:text-stone-100 mb-2 tracking-tighter">
              {note.name}
            </Text>
            <Text className="text-sm text-stone-500 dark:text-stone-400">
              {note.date}
            </Text>
          </View>

          <View className="h-[1px] w-[90%] self-center bg-whisky/30 mb-8" />

          {/* 노트 섹션 */}
          <View className="px-5 mb-6">
            <Section title="Nose" icon="👃" content={note.nose?.memo} />
            <Section title="Palate" icon="👅" content={note.palate?.memo} />
            <Section title="Finish" icon="🏁" content={note.finish?.memo} />
          </View>

          {/* 총평 */}
          <View className="mx-5 p-5 border border-dashed border-stone-300 dark:border-stone-700 rounded-2xl bg-white dark:bg-stone-800">
            <Text className="text-sm font-bold text-stone-500 dark:text-stone-400 mb-2">
              총평
            </Text>
            <Text className="text-base text-stone-800 dark:text-stone-200 leading-6">
              {note.content}
            </Text>
          </View>
        </ScrollView>
      </View>
    </Modal>
  );
};
