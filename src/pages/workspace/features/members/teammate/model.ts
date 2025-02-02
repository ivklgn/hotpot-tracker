import { reatomInstantQueryAtom, reatomInstantSubscription } from '../../../../../reatom-instantdb';
import { currentTeamAtom } from '../../../../../features/account/model';

const teammateMembershipsQueryAtom = reatomInstantQueryAtom((ctx) => {
  const currentTeam = ctx.get(currentTeamAtom);
  if (!currentTeam) return null;
  console.log({ currentTeam });

  return {
    memberships: {
      $: {
        where: {
          'teams.id': currentTeam?.id as string,
          userId: {
            $isNull: false,
          },
        },
      },
    },
  };
}, 'teamsQueryAtom');

export const teammateMembershipsSubscription = reatomInstantSubscription(
  teammateMembershipsQueryAtom,
  'membershipsSubscription'
);
