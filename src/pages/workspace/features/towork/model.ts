import { reatomAsync, withErrorAtom } from '@reatom/framework';
import { db } from '../../../../instantdb';
import { userAtom } from '../../../../features/auth/model';
import { reatomInstantSubscription } from '../../../../reatom-instantdb';

export const myInvitesSubscription = reatomInstantSubscription(null, 'myInvitesSubscription');

userAtom.onChange((ctx, user) => {
  myInvitesSubscription.queryAtom(ctx, {
    invites: {
      $: {
        where: {
          userEmail: user?.email as string,
          status: 'pending',
        },
      },
    },
  });
});

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
