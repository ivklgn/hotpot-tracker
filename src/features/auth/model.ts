import { User } from '@instantdb/core';
import { atom, onConnect, reatomAsync, withErrorAtom } from '@reatom/framework';
import { db } from '../../instantdb';

export const userAtom = atom<User | undefined>(undefined, 'userAtom');

export const userAuthLoadingAtom = atom(false, 'userAuthLoadingAtom');

onConnect(userAtom, (ctx) => {
  userAuthLoadingAtom(ctx, true);

  const unsubscribe = db.subscribeAuth((resp) => {
    if (resp.user) {
      userAtom(ctx, resp.user);
    }
    userAuthLoadingAtom(ctx, false);
  });

  return () => {
    unsubscribe();
  };
});

export const fetchSignOutAtom = reatomAsync(() => db.auth.signOut(), {
  name: 'fetchSignOutAtom',
  onFulfill: (ctx) => {
    userAtom(ctx, undefined);
  },
}).pipe(
  withErrorAtom((_ctx, error) => {
    return error;
  })
);
