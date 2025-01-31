import { reatomInstantSubscription } from '../../../../../reatom-instantdb';
import { currentTeamAtom } from '../../../../../features/account/model';

export const membershipsSubscription = reatomInstantSubscription(null, 'membershipsSubscription');

currentTeamAtom.onChange((ctx, currentTeam) => {
  membershipsSubscription.queryAtom(ctx, {
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
  });
});
