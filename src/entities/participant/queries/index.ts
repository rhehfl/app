import { queryOptions } from '@tanstack/react-query';

import { getParticipants } from '../api/participantApi';

export const participantsQueryOptions = (roomId: string) =>
  queryOptions({
    queryKey: ['participants', roomId],
    queryFn: () => getParticipants(roomId),
    enabled: !!roomId,
  });
