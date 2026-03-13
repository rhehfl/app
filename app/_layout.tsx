import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Stack } from 'expo-router';
import '../global.css';

const queryClient = new QueryClient();

export default function RootLayout() {
  return (
    <QueryClientProvider client={queryClient}>
      <Stack>
        <Stack.Screen name="index" options={{ headerShown: false }} />
        <Stack.Screen
          name="room/create"
          options={{ headerShown: true, title: '방 만들기', headerBackTitle: '취소' }}
        />
        <Stack.Screen
          name="room/join"
          options={{ headerShown: true, title: '방 참여', headerBackTitle: '취소' }}
        />
        <Stack.Screen name="room/[id]/waiting" options={{ headerShown: false }} />
        <Stack.Screen name="room/[id]/battle" options={{ headerShown: false }} />
        <Stack.Screen name="room/[id]/result" options={{ headerShown: false }} />
      </Stack>
    </QueryClientProvider>
  );
}
