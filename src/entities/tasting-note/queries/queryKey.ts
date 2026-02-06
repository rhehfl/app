import { queryOptions } from '@tanstack/react-query';

import { getTastingNoteById } from '@/entities/tasting-note/api/getTastingNoteById';
import { getTastingNotes } from '@/entities/tasting-note/api/getTastingNotes';

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
  detailQuery: (id: string) =>
    queryOptions({
      queryKey: tastingNoteKeys.detail(id),
      queryFn: () => getTastingNoteById(id),
    }),
};
