import { atom } from '@reatom/framework';
import { withLocalStorage } from '@reatom/persist-web-storage';
import { reatomInstantQueryAtom, reatomInstantSubscription } from '../../reatom-instantdb';

const teamsQueryAtom = reatomInstantQueryAtom(
  () => ({
    teams: {},
  }),
  'teamsQueryAtom'
);

export const teamsSubscription = reatomInstantSubscription(teamsQueryAtom, 'teamsSubscription');

export const currentTeamIdAtom = atom<string | null>(null, 'currentTeamIdAtom').pipe(
  withLocalStorage('currentTeamIdAtom')
);

teamsSubscription.dataAtom.onChange((ctx, teams) => {
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore
  if (teams && teams?.teams?.length > 0) {
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    currentTeamIdAtom(ctx, teams?.teams?.[0].id);
  }
});

export const currentTeamAtom = atom((ctx) => {
  const currentTeamId = ctx.spy(currentTeamIdAtom);
  const teams = ctx.spy(teamsSubscription.dataAtom);
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore
  return currentTeamId ? (teams?.teams || []).find((team) => team.id === currentTeamId) : teams.teams?.[0];
}, 'currentTeamAtom');
