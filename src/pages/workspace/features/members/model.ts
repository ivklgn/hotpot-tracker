import * as RD from '@young-aviator-club/remote-data';
import { atom, onConnect, reatomAsync, withErrorAtom } from '@reatom/framework';
import { db } from '../../../../instantdb';
import { currentTeamIdAtom } from '../../../../features/account/model';
import { id } from '@instantdb/react';
import { userAtom } from '../../../../features/auth/model';

export const membershipsAtom = atom<RD.RemoteData<Error, any[]>>(RD.notAsked(), 'membershipsAtom');
export const invitesAtom = atom<RD.RemoteData<Error, any[]>>(RD.notAsked(), 'invitesAtom');

onConnect(membershipsAtom, async (ctx) => {
  membershipsAtom(ctx, RD.loading());

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
          },
        },
      },
    },
    (resp) => {
      if (resp.error) {
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-expect-error
        membershipsAtom(ctx, RD.failure(resp.error));
        return;
      }
      if (resp.data) {
        membershipsAtom(ctx, RD.success(resp.data.memberships));
      }
    }
  );

  return () => {
    unsubscribe();
  };
});

onConnect(membershipsAtom, async (ctx) => {
  invitesAtom(ctx, RD.loading());

  const teamId = ctx.get(currentTeamIdAtom);

  if (!teamId) {
    // TODO: exception?
    return;
  }

  const unsubscribe = db.subscribeQuery(
    {
      invites: {
        $: {
          where: {
            'teams.id': teamId,
          },
        },
      },
    },
    (resp) => {
      if (resp.error) {
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-expect-error
        invitesAtom(ctx, RD.failure(resp.error));
        return;
      }
      if (resp.data) {
        invitesAtom(ctx, RD.success(resp.data.invites));
      }
    }
  );

  return () => {
    unsubscribe();
  };
});

export const fetchInviteMemberAtom = reatomAsync(
  (
    _ctx,
    {
      teamId,
      userEmail,
      teamName,
    }: {
      teamId: string;
      userEmail: string;
      teamName: string;
    }
  ) => {
    const inviteId = id();
    const membershipId = id();

    return db.transact([
      db.tx.memberships[membershipId].update({ teamId, userEmail }),
      db.tx.memberships[membershipId].link({ teams: teamId }),
      db.tx.invites[inviteId].update({ userEmail, teamId, teamName, status: 'pending', membershipId }),
      db.tx.invites[inviteId].link({ teams: teamId }),
    ]);
  },
  {
    name: 'fetchInviteMemberAtom',
  }
).pipe(
  withErrorAtom((_ctx, error) => {
    console.log(error);
    return error;
  })
);
