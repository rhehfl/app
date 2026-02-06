import { router } from 'expo-router';
import { NotebookPenIcon } from 'lucide-react-native';
import { TouchableOpacity } from 'react-native';
import { cssInterop } from 'react-native-css-interop';

cssInterop(NotebookPenIcon, {
  className: {
    target: 'style',
    nativeStyleToProp: {
      color: true,
    },
  },
});

export function CreateNoteButton() {
  return (
    <TouchableOpacity
      onPress={() => router.push('/write')}
      activeOpacity={0.8}
      className="absolute bottom-6 right-6 w-16 h-16 bg-amber-600 dark:bg-amber-500 rounded-full items-center justify-center z-50 shadow-lg elevation-6"
    >
      <NotebookPenIcon
        className="text-white dark:text-slate-900"
        size={30}
        strokeWidth={2.5}
      />
    </TouchableOpacity>
  );
}
