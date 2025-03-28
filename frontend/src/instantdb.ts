import { init } from '@instantdb/react';
import schema from '@hotpot-tracker/instantdb/instant.schema';

export const db = init({
  appId: import.meta.env.VITE_INSTANT_APP_ID,
  schema,
});
