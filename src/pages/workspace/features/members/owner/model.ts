import * as RD from '@young-aviator-club/remote-data';
import { atom, onConnect, reatomAsync, withErrorAtom } from '@reatom/framework';
import { id } from '@instantdb/core';
import { currentTeamIdAtom } from '../../../../../features/account/model';
import { db } from '../../../../../instantdb';

const membershipsAtom = atom<RD.RemoteData<Error, any[]>>(RD.notAsked(), 'membershipsAtom');
const invitesAtom = atom<RD.RemoteData<Error, any[]>>(RD.notAsked(), 'invitesAtom');

type Member = {
  membershipId: string;
  userEmail: string;
  userId: string;
  invite?: { inviteId: string; status: 'pending' | 'accepted' | 'declined' };
};

export const membersAtom = atom<Member[]>((ctx) => {
  const memberships = ctx.spy(membershipsAtom);
  const invites = ctx.spy(invitesAtom);

  if (RD.isSuccess(memberships) && RD.isSuccess(invites)) {
    const userEmailAsInviteStatus = invites.data.reduce((acc, invite) => {
      acc[invite.userEmail] = { inviteId: invite.id, status: invite.status };
      return acc;
    }, {} as Record<string, 'pending' | 'accepted' | 'rejected'>);

    return memberships.data.map((membership) => ({
      membershipId: membership.id,
      userEmail: membership.userEmail,
      userId: membership.userId,
      invite: userEmailAsInviteStatus[membership.userEmail],
    }));
  }

  return [];
});

onConnect(membersAtom, async (ctx) => {
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
            // 'teams.id': teamId,
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

onConnect(membersAtom, async (ctx) => {
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
    return error;
  })
);

export const fetchDeleteMembershipAtom = reatomAsync(
  (_ctx, membershipId: string, inviteId: string) => {
    return db.transact([db.tx.invites[inviteId].delete(), db.tx.memberships[membershipId].delete()]);
  },
  {
    name: 'fetchDeleteMembershipAtom',
  }
).pipe(
  withErrorAtom((_ctx, error) => {
    return error;
  })
);
