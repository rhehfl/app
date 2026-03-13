import { queryOptions } from '@tanstack/react-query';

import { getRoomById, getRoomByInviteCode } from '../api/roomApi';

export const roomQueryOptions = (roomId: string) =>
  queryOptions({
    queryKey: ['room', roomId],
    queryFn: () => getRoomById(roomId),
    enabled: !!roomId,
  });

export const roomByCodeQueryOptions = (code: string) =>
  queryOptions({
    queryKey: ['room', 'code', code],
    queryFn: () => getRoomByInviteCode(code),
    enabled: !!code,
  });
