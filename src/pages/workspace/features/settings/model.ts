import { reatomAsync, withErrorAtom } from '@reatom/async';
import { db } from '../../../../instantdb';

export const fetchRenameTeamAtom = reatomAsync(
  (_ctx, teamId: string, newName: string) => db.transact([db.tx.teams[teamId].merge({ name: newName })]),
  'fetchRenameTeamAtom'
).pipe(
  withErrorAtom((_ctx, error) => {
    return error;
  })
);

export const fetchDeleteTeamAtom = reatomAsync(
  (_ctx, teamId: string) => db.transact([db.tx.teams[teamId].delete()]),
  'fetchDeleteTeamAtom'
).pipe(
  withErrorAtom((_ctx, error) => {
    return error;
  })
);
