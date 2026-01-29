import { router } from 'expo-router';
import { NotebookPenIcon } from 'lucide-react-native';
import { TouchableOpacity, Platform } from 'react-native';

export function CreateNoteButton() {
  const handlePress = () => {
    router.push('/write');
  };

  return (
    <TouchableOpacity
      onPress={handlePress}
      activeOpacity={0.8}
      className="absolute bottom-6 right-6 w-16 h-16 bg-primary rounded-full items-center justify-center z-50"
      style={{
        ...Platform.select({
          ios: {
            shadowColor: '#000',
            shadowOffset: { width: 0, height: 4 },
            shadowOpacity: 0.3,
            shadowRadius: 4.5,
          },
          android: {
            elevation: 6,
          },
        }),
      }}
    >
      <NotebookPenIcon color="#ffffff" size={30} strokeWidth={2.5} />
    </TouchableOpacity>
  );
}
