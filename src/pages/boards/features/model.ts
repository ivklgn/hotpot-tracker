import { reatomAsync, withErrorAtom } from '@reatom/framework';
import { db } from '../../../instantdb';
import { id } from '@instantdb/core';
import { currentTeamAtom, currentTeamIdAtom } from '../../../features/account/model';
import { reatomInstantQueryAtom, reatomInstantSubscription } from '../../../reatom-instantdb';

const boardsQueryAtom = reatomInstantQueryAtom((ctx) => {
  const currentTeamId = ctx.get(currentTeamIdAtom);

  return {
    boards: {
      $: {
        where: {
          teamId: currentTeamId as string,
        },
      },
    },
  };
}, 'boardsQueryAtom');

export const boardsSubscription = reatomInstantSubscription(boardsQueryAtom, 'boardsSubscription');

export const fetchCreateBoardAtom = reatomAsync(
  (
    ctx,
    {
      name,
    }: {
      name: string;
    }
  ) => {
    const currentTeam = ctx.get(currentTeamAtom);

    return db.transact([
      db.tx.boards[id()].update({ name, teamId: currentTeam?.id }).link({ teams: currentTeam?.id }),
    ]);
  },
  {
    name: 'fetchCreateBoardAtom',
  }
).pipe(
  withErrorAtom((_ctx, error) => {
    return error;
  })
);
