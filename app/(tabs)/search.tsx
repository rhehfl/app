// app/(tabs)/index.tsx (예시)
import { Text } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function HomeScreen() {
  return (
    <SafeAreaView className="flex-1 bg-background justify-center items-center">
      <Text className="text-foreground text-2xl font-bold">검색 화면</Text>
    </SafeAreaView>
  );
}
