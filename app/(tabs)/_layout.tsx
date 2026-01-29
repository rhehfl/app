import { Tabs } from 'expo-router';
import { Home, Search, User, NotebookPen } from 'lucide-react-native';
import { useColorScheme } from 'nativewind';

export default function TabLayout() {
  const { colorScheme } = useColorScheme();
  const isDark = colorScheme === 'dark';

  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarStyle: {
          backgroundColor: isDark ? '#121212' : '#ffffff',
          height: 80,
          shadowColor: '#000',
          shadowOffset: {
            width: 0,
            height: -2,
          },
          shadowOpacity: 0.1,
          shadowRadius: 10,
          elevation: 5,
        },

        tabBarActiveTintColor: isDark ? '#fbbf24' : '#d97706',
        tabBarInactiveTintColor: isDark ? '#52525b' : '#a1a1aa',
        tabBarShowLabel: false,
        tabBarItemStyle: {
          justifyContent: 'center',
          alignItems: 'center',
          paddingTop: 20,
        },
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: '홈',
          tabBarIcon: ({ color }) => <Home color={color} size={30} />,
        }}
      />
      <Tabs.Screen
        name="search"
        options={{
          title: '검색',
          tabBarIcon: ({ color }) => <Search color={color} size={30} />,
        }}
      />
      <Tabs.Screen
        name="write"
        options={{
          title: '기록',
          tabBarIcon: ({ color }) => <NotebookPen color={color} size={30} />,
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: '내 정보',
          tabBarIcon: ({ color }) => <User color={color} size={30} />,
        }}
      />
    </Tabs>
  );
}
