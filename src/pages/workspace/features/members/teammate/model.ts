import * as RD from '@young-aviator-club/remote-data';
import { atom, onConnect } from '@reatom/framework';
import { currentTeamIdAtom } from '../../../../../features/account/model';
import { db } from '../../../../../instantdb';

export const teammateMembershipsAtom = atom<RD.RemoteData<Error, any[]>>(
  RD.notAsked(),
  'teammateMembershipsAtom'
);

onConnect(teammateMembershipsAtom, async (ctx) => {
  teammateMembershipsAtom(ctx, RD.loading());

  const teamId = ctx.get(currentTeamIdAtom);

  if (!teamId) {
    // TODO: exception
    return;
  }

  const unsubscribe = db.subscribeQuery(
    {
      memberships: {
        $: {
          where: {
            'teams.id': teamId,
            userId: {
              $isNull: false,
            },
          },
        },
      },
    },
    (resp) => {
      if (resp.error) {
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-expect-error
        teammateMembershipsAtom(ctx, RD.failure(resp.error));
        return;
      }
      if (resp.data) {
        teammateMembershipsAtom(ctx, RD.success(resp.data.memberships));
      }
    }
  );

  return () => {
    unsubscribe();
  };
});
