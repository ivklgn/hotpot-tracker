import { reatomAsync, withErrorAtom } from '@reatom/async';
import { db } from '../../../../instantdb';

export const fetchDeleteTeamAtom = reatomAsync(
  (_ctx, teamId: string) => db.transact([db.tx.teams[teamId].delete()]),
  'fetchDeleteTeamAtom'
).pipe(
  withErrorAtom((_ctx, error) => {
    return error;
  })
);
