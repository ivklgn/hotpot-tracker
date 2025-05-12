import { db } from '../../../../instantdb';
import { useAccount } from '../../../../features/account/AccountContext';
import { OwnerSettings } from './Owner';
import { TeammateSettings } from './Teammate';

export function Settings() {
  const { user } = db.useAuth();
  const { currentTeamId } = useAccount();
  const { data: currentTeam } = db.useQuery({ teams: { $: { where: { id: currentTeamId as string } } } });

  if (user?.id === currentTeam?.teams?.[0]?.creatorId) {
    return <OwnerSettings />;
  }

  return <TeammateSettings />;
}
