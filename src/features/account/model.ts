import { atom } from '@reatom/framework';
import { withLocalStorage } from '@reatom/persist-web-storage';
import { reatomInstantSubscription } from '../../reatom-instantdb';

export const teamsSubscription = reatomInstantSubscription({ teams: {} }, 'teamsSubscription');

export const currentTeamIdAtom = atom<string | null>(null, 'currentTeamIdAtom').pipe(
  withLocalStorage('currentTeamIdAtom')
);

export const currentTeamAtom = atom((ctx) => {
  const currentTeamId = ctx.spy(currentTeamIdAtom);
  const teams = ctx.spy(teamsSubscription.dataAtom);
  return currentTeamId
    ? teams?.data?.teams?.find((team) => team.id === currentTeamId)
    : teams?.data?.teams?.[0];
}, 'currentTeamAtom');
