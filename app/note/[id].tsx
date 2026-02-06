import { router, useLocalSearchParams } from 'expo-router';

import { NoteDetail } from '@/entities/tasting-note/ui/NoteDetail';

export default function NoteDetailScreen() {
  const { id } = useLocalSearchParams();
  return (
    <NoteDetail
      id={String(id)}
      onClose={() => {
        router.back();
      }}
    />
  );
}
