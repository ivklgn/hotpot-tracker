import { Box } from '@chakra-ui/react';
import { LuUser, LuFocus, LuSettings } from 'react-icons/lu';
import { Tabs } from '@chakra-ui/react';
import { Settings } from './features/settings/Settings';
import { Members } from './features/members';
import { ToWork } from './features/towork/ToWork';
import { db } from '../../instantdb';
import { useAccount } from '../../features/account/AccountContext';

export function WorkspacePage() {
  const { user } = db.useAuth();
  const { currentTeamId } = useAccount();
  const { data: currentTeam } = db.useQuery({ teams: { $: { where: { id: currentTeamId as string } } } });
  const { data: teams } = db.useQuery({ teams: {} });

  if (teams?.teams?.length === 0) {
    return (
      <Box flex="1" pt={8} mx={6}>
        <Tabs.Root defaultValue="towork" lazyMount>
          <Tabs.List>
            <Tabs.Trigger value="towork">
              <LuFocus />
              To work
            </Tabs.Trigger>
          </Tabs.List>
          <Tabs.Content value="towork">
            <ToWork />
          </Tabs.Content>
        </Tabs.Root>
      </Box>
    );
  }

  if (user?.id === currentTeam?.teams?.[0]?.creatorId) {
    return (
      <Box flex="1" pt={8} mx={6}>
        <Tabs.Root defaultValue="towork" lazyMount>
          <Tabs.List>
            <Tabs.Trigger value="towork">
              <LuFocus />
              To work
            </Tabs.Trigger>
            <Tabs.Trigger value="members">
              <LuUser />
              Members
            </Tabs.Trigger>
            <Tabs.Trigger value="settings">
              <LuSettings />
              Settings
            </Tabs.Trigger>
          </Tabs.List>
          <Tabs.Content value="towork">
            <ToWork />
          </Tabs.Content>
          <Tabs.Content value="members">
            <Members />
          </Tabs.Content>
          <Tabs.Content value="settings">
            <Settings />
          </Tabs.Content>
        </Tabs.Root>
      </Box>
    );
  }

  return (
    <Box flex="1" pt={8} mx={6}>
      <Tabs.Root defaultValue="towork" lazyMount>
        <Tabs.List>
          <Tabs.Trigger value="towork">
            <LuFocus />
            To work
          </Tabs.Trigger>
          <Tabs.Trigger value="members">
            <LuUser />
            Members
          </Tabs.Trigger>
        </Tabs.List>
        <Tabs.Content value="towork">
          <ToWork />
        </Tabs.Content>
        <Tabs.Content value="members">
          <Members />
        </Tabs.Content>
      </Tabs.Root>
    </Box>
  );
}
