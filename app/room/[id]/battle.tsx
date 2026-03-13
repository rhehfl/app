import { useLocalSearchParams } from 'expo-router';

import { BattlePage } from '@/pages/room';

export default function BattleScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  return <BattlePage roomId={id} />;
}
