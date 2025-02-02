import { reatomAsync, withErrorAtom } from '@reatom/framework';
import { db } from '../../../../instantdb';
import { userAtom } from '../../../../features/auth/model';
import { reatomInstantQueryAtom, reatomInstantSubscription } from '../../../../reatom-instantdb';

const myInvitesQueryAtom = reatomInstantQueryAtom((ctx) => {
  const user = ctx.get(userAtom);
  return {
    invites: {
      $: {
        where: {
          userEmail: user?.email as string,
          status: 'pending',
        },
      },
    },
  };
}, 'myInvitesQueryAtom');

export const myInvitesSubscription = reatomInstantSubscription(myInvitesQueryAtom, 'myInvitesSubscription');

export const fetchAcceptInviteAtom = reatomAsync(
  (
    ctx,
    {
      inviteId,
      membershipId,
    }: {
      inviteId: string;
      membershipId: string;
    }
  ) => {
    const userId = ctx.get(userAtom)?.id;

    return db.transact([
      db.tx.invites[inviteId].update({ status: 'accepted' }),
      db.tx.memberships[membershipId].update({ userId }),
    ]);
  },
  {
    name: 'fetchAcceptInviteAtom',
  }
).pipe(
  withErrorAtom((_ctx, error) => {
    return error;
  })
);
