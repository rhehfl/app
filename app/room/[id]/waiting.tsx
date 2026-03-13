import { useLocalSearchParams } from 'expo-router';

import { WaitingPage } from '@/pages/room';

export default function WaitingScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  return <WaitingPage roomId={id} />;
}
