import { atom, reatomAsync, withErrorAtom } from '@reatom/framework';
import { id } from '@instantdb/core';
import { db } from '../../../../../instantdb';
import { reatomInstantDBSubscription } from '../../../../../reatom-instantdb';

export const membershipsAtom = reatomInstantDBSubscription({
  memberships: {},
});

export const invitesAtom = reatomInstantDBSubscription({
  invites: {},
});

export const membersAtom = atom((ctx) => {
  const memberships = ctx.spy(membershipsAtom.dataAtom);
  const invites = ctx.spy(invitesAtom.dataAtom);

  if (memberships?.data?.memberships && invites?.data?.invites) {
    const userEmailAsInviteStatus = invites?.data?.invites?.reduce((acc, invite) => {
      acc[invite.userEmail] = {
        inviteId: invite.id,
        status: invite.status as 'pending' | 'accepted' | 'declined',
      } as const;
      return acc;
    }, {} as Record<string, { inviteId: string; status: 'pending' | 'accepted' | 'declined' }>);

    return memberships?.data?.memberships?.map((membership) => ({
      membershipId: membership.id,
      userEmail: membership.userEmail,
      userId: membership.userId,
      invite: userEmailAsInviteStatus[membership.userEmail],
    }));
  }

  return [];
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
