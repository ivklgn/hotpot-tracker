import { reatomAsync, withErrorAtom } from '@reatom/async';
import { db } from '../../../../instantdb';

export const fetchDeleteTeam = reatomAsync(
  (ctx, teamId: string) => db.transact([db.tx.teams[teamId].delete()]),
  'fetchDeleteTeam'
).pipe(
  withErrorAtom((ctx, error) => {
    console.log(error);
    return error;
  })
);
