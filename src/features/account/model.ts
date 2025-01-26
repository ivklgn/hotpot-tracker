import { atom, onConnect } from '@reatom/framework';
import { withLocalStorage } from '@reatom/persist-web-storage';
import { db } from '../../instantdb';
import * as RD from '@young-aviator-club/remote-data';

export const currentTeamIdAtom = atom<string | null>(null, 'currentTeamIdAtom').pipe(
  withLocalStorage('currentTeamIdAtom')
);

export const teamsAtom = atom<RD.RemoteData<Error, any[]>>(RD.notAsked(), 'teamsAtom');

onConnect(teamsAtom, (ctx) => {
  teamsAtom(ctx, RD.loading());

  const unsubscribe = db.subscribeQuery({ teams: {} }, (resp) => {
    if (resp.error) {
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-expect-error
      teamsAtom(ctx, RD.failure(resp.error));
      return;
    }
    if (resp.data) {
      teamsAtom(ctx, RD.success(resp.data.teams));
      currentTeamIdAtom(ctx, resp.data.teams?.[0]?.id ?? null);
    }
  });

  return () => {
    unsubscribe();
  };
});

export const currentTeamAtom = atom<any>((ctx) => {
  const currentTeamId = ctx.spy(currentTeamIdAtom);
  const teams = RD.successOrElse(ctx.spy(teamsAtom), () => []);
  return currentTeamId ? teams.find((team) => team.id === currentTeamId) : teams[0];
}, 'currentTeamAtom');
