import { queryOptions } from '@tanstack/react-query';

import { getUser } from '../api/userApi';

export const userQueryOptions = (userId: string) =>
  queryOptions({
    queryKey: ['user', userId],
    queryFn: () => getUser(userId),
    enabled: !!userId,
  });
