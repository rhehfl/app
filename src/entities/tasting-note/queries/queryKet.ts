import { queryOptions } from '@tanstack/react-query';

import { getTastingNotes } from '@/entities/tasting-note';

export const tastingNoteKeys = {
  all: ['tasting-notes'] as const,
  lists: () => [...tastingNoteKeys.all, 'list'] as const,
  details: () => [...tastingNoteKeys.all, 'detail'] as const,
  detail: (id: string) => [...tastingNoteKeys.details(), id] as const,
  list: () =>
    queryOptions({
      queryKey: tastingNoteKeys.lists(),
      queryFn: getTastingNotes,
    }),
};
