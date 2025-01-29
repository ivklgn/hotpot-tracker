import { atom } from '@reatom/framework';
import { withLocalStorage } from '@reatom/persist-web-storage';
import { reatomInstantDBSubscription } from '../../reatom-instantdb';

export const teamsAtom = reatomInstantDBSubscription({
  teams: {},
});

export const currentTeamIdAtom = atom<string | null>(null, 'currentTeamIdAtom').pipe(
  withLocalStorage('currentTeamIdAtom')
);

export const currentTeamAtom = atom((ctx) => {
  const currentTeamId = ctx.spy(currentTeamIdAtom);
  const teams = ctx.spy(teamsAtom.dataAtom);
  return currentTeamId
    ? teams?.data?.teams?.find((team) => team.id === currentTeamId)
    : teams?.data?.teams?.[0];
}, 'currentTeamAtom');
