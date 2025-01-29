import {
  coerceQuery,
  type InstaQLParams,
  InstantCoreDatabase,
  InstaQLLifecycleState,
  InstantSchemaDef,
} from '@instantdb/core';
import { atom, AtomMut, onConnect } from '@reatom/framework';
import { db } from './instantdb';

export const initReatomInstantDBSubscription =
  <Q extends InstaQLParams<Schema>, Schema extends InstantSchemaDef<any, any, any>>(
    _core: InstantCoreDatabase<Schema>
  ) =>
  (
    _query: null | Q
  ): {
    dataAtom: AtomMut<InstaQLLifecycleState<Schema, Q> | undefined>;
    loadingAtom: AtomMut<boolean>;
    errorAtom: AtomMut<{ message: string } | null>;
  } => {
    const query = _query ? coerceQuery(_query) : null;

    const loadingAtom = atom(false, 'loadingAtom');
    const errorAtom = atom<{ message: string } | null>(null, 'errorAtom');
    const dataAtom = atom<InstaQLLifecycleState<Schema, Q> | undefined>(undefined, 'dataAtom');

    onConnect(dataAtom, (ctx) => {
      const unsubscribe = db.subscribeQuery(query, (resp) => {
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
    });

    return { dataAtom, errorAtom, loadingAtom };
  };

export const reatomInstantDBSubscription = initReatomInstantDBSubscription(db);
