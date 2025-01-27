import * as RD from '@young-aviator-club/remote-data';
import { atom, onConnect, reatomAsync, withErrorAtom } from '@reatom/framework';
import { db } from '../../../../instantdb';
import { userAtom } from '../../../../features/auth/model';
import { id } from '@instantdb/react';

export const myInvitesAtom = atom<RD.RemoteData<Error, any[]>>(RD.notAsked(), 'invitesAtom');

onConnect(myInvitesAtom, async (ctx) => {
  myInvitesAtom(ctx, RD.loading());

  const user = ctx.get(userAtom);

  const unsubscribe = db.subscribeQuery(
    {
      invites: {
        $: {
          where: {
            userEmail: user?.email as string,
          },
        },
      },
    },
    (resp) => {
      if (resp.error) {
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-expect-error
        myInvitesAtom(ctx, RD.failure(resp.error));
        return;
      }
      if (resp.data) {
        myInvitesAtom(ctx, RD.success(resp.data.invites));
      }
    }
  );

  return () => {
    unsubscribe();
  };
});

export const fetchAcceptInviteAtom = reatomAsync(
  (
    ctx,
    {
      membershipId,
    }: {
      membershipId: string;
    }
  ) => {
    const userId = ctx.get(userAtom)?.id;

    return db.transact([db.tx.memberships[membershipId].update({ userId })]);
  },
  {
    name: 'fetchAcceptInviteAtom',
  }
).pipe(
  withErrorAtom((_ctx, error) => {
    console.log('here', error);
    return error;
  })
);
