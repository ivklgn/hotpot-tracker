import { type InstaQLParams, InstaQLLifecycleState } from '@instantdb/core';
import { Action, atom, AtomMut, Ctx, onConnect } from '@reatom/framework';
import { db } from './instantdb';
import { AppSchema } from '../instant.schema';

export interface InstantSubscriptionQueryAtom<Q> extends AtomMut<Q> {
  set: Action<[InstaQLParams<AppSchema>], Q>;
  reset: Action<[], Q>;
}

export const reatomInstantSubscription = <Q extends InstaQLParams<AppSchema>>(
  initQuery: Q | null,
  name?: string
): {
  dataAtom: AtomMut<InstaQLLifecycleState<AppSchema, Q> | undefined>;
  loadingAtom: AtomMut<boolean>;
  errorAtom: AtomMut<{ message: string } | null>;
  queryAtom: AtomMut<InstaQLParams<AppSchema> | undefined>;
} => {
  const loadingAtom = atom(false, `${name}loadingAtom`);
  const errorAtom = atom<{ message: string } | null>(null, `${name}errorAtom`);
  const dataAtom = atom<InstaQLLifecycleState<AppSchema, Q> | undefined>(undefined, `${name}dataAtom`);
  const queryAtom = atom<InstaQLParams<AppSchema> | null>(initQuery, `${name}queryAtom`);

  const sub = (
    ctx: Ctx & {
      controller: AbortController;
      isConnected(): boolean;
    }
  ) => {
    const q = ctx.get(queryAtom);

    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    const unsubscribe = db.subscribeQuery(q, (resp) => {
      loadingAtom(ctx, true);
      if (resp.error) {
        loadingAtom(ctx, false);
        errorAtom(ctx, resp.error);
        return;
      }
      if (resp.data) {
        loadingAtom(ctx, false);
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        dataAtom(ctx, resp);
      }
    });

    return () => {
      unsubscribe();
    };
  };

  onConnect(dataAtom, sub);

  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore
  return { dataAtom, errorAtom, loadingAtom, queryAtom };
};
