import { View, Text } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function WriteScreen() {
  return (
    <SafeAreaView className="flex-1 bg-background">
      {/* 헤더: 테두리 없애고, 폰트 키우고, 여백 추가 */}
      <View className="px-6 pt-6 pb-4">
        <Text className="text-3xl font-extrabold text-foreground mt-1">
          테이스팅 노트 기록
        </Text>
      </View>
    </SafeAreaView>
  );
}
