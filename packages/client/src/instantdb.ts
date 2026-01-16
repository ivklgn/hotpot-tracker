import { init } from '@instantdb/react';
import { schema } from '@hotpot/shared';

export const db = init({
  appId: import.meta.env.VITE_INSTANT_APP_ID,
  schema,
});
