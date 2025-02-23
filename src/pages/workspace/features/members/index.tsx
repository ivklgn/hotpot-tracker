import { TeammateMembers } from './teammate';
import { OwnerMembers } from './owner';
import { db } from '../../../../instantdb';
import { useAccount } from '../../../../features/account/AccountContext';

export function Members() {
  const { user } = db.useAuth();
  const { currentTeamId } = useAccount();
  const { data: currentTeam } = db.useQuery({ teams: { $: { where: { id: currentTeamId as string } } } });

  if (user?.id === currentTeam?.teams?.[0]?.creatorId) {
    return <OwnerMembers />;
  }

  return <TeammateMembers />;
}
