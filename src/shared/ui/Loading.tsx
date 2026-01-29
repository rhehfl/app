import { View, ActivityIndicator } from 'react-native';

export function Loading() {
  return (
    <View className="flex-1 justify-center items-center py-20">
      <ActivityIndicator size="large" color="#fbbf24" />
    </View>
  );
}
