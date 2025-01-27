import { reatomAsync, withErrorAtom } from '@reatom/async';
import { db } from '../../../../instantdb';

export const fetchDeleteTeamAtom = reatomAsync(
  (ctx, teamId: string) => db.transact([db.tx.teams[teamId].delete()]),
  'fetchDeleteTeamAtom'
).pipe(
  withErrorAtom((ctx, error) => {
    console.log(error);
    return error;
  })
);
