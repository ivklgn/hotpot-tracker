import { useAtom } from '@reatom/npm-react';
import { userAtom } from '../../../../features/auth/model';
import { currentTeamAtom } from '../../../../features/account/model';
import { TeammateMembers } from './teammate';
import { OwnerMembers } from './owner';

export function Members() {
  const [user] = useAtom(userAtom);
  const [currentTeam] = useAtom(currentTeamAtom);

  if (user?.id === currentTeam?.creatorId) {
    return <OwnerMembers />;
  }

  return <TeammateMembers />;
}
