import { useLocalSearchParams } from 'expo-router';

import { ResultPage } from '@/pages/result';

export default function ResultScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  return <ResultPage roomId={id} />;
}
