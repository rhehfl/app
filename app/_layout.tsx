import { QueryClient, QueryClientProvider } from '@tanstack/react-query'; // 👈 추가
import { Stack } from 'expo-router';
import '../global.css';

const queryClient = new QueryClient();

export default function RootLayout() {
  return (
    <QueryClientProvider client={queryClient}>
      <Stack>
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
        <Stack.Screen
          name="write"
          options={{
            presentation: 'modal',
            headerShown: true,
            title: '새 노트 작성',
            headerBackTitle: '취소',
          }}
        />
        <Stack.Screen name="note/[id]" options={{ headerShown: false }} />
      </Stack>
    </QueryClientProvider>
  );
}
