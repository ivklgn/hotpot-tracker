import { type InstaQLParams, InstaQLLifecycleState } from '@instantdb/core';
import { Atom, atom, AtomMut, Ctx, onConnect } from '@reatom/framework';
import { db } from './instantdb';
import { AppSchema } from '../instant.schema';

export const reatomInstantQueryAtom = <Q extends InstaQLParams<AppSchema>>(
  atomCb: (ctx: Ctx) => Q | null,
  name?: string
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore
): Atom<InstaQLParams<AppSchema>> => atom(atomCb, name);

export const reatomInstantSubscription = <Q extends InstaQLParams<AppSchema>>(
  queryAtom: Atom<Q | null>,
  name?: string
): {
  dataAtom: AtomMut<InstaQLLifecycleState<AppSchema, Q>['data'] | undefined>;
  loadingAtom: AtomMut<boolean>;
  errorAtom: AtomMut<{ message: string } | null>;
} => {
  const loadingAtom = atom(false, `${name}loadingAtom`);
  const errorAtom = atom<{ message: string } | null>(null, `${name}errorAtom`);
  const dataAtom = atom<InstaQLLifecycleState<AppSchema, Q>['data'] | undefined>(
    undefined,
    `${name}dataAtom`
  );

  const sub = (ctx: Ctx) => {
    const q = ctx.get(queryAtom);
    if (!q) return;
    console.log('sub', q, name);
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
        dataAtom(ctx, resp.data);
      }
    });

    return () => {
      console.log('unsub', q, name);
      unsubscribe();
    };
  };

  onConnect(dataAtom, sub);

  return { dataAtom, errorAtom, loadingAtom };
};
