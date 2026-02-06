import { mutationOptions } from '@tanstack/react-query';

import { addTastingNote } from '@/entities/tasting-note/api/addTastingNote';

export const tastingNoteMutationOptions = {
  add: () => mutationOptions({ mutationFn: addTastingNote }),
};
