export const battleKeys = {
  all: ['battles'] as const,
  detail: (id: string) => ['battles', id] as const,
  logs: (battleId: string) => ['battles', battleId, 'logs'] as const,
};
