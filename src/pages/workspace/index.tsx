import * as RD from '@young-aviator-club/remote-data';
import { Box } from '@chakra-ui/react';
import { LuUser, LuFocus, LuSettings } from 'react-icons/lu';
import { Tabs } from '@chakra-ui/react';
import { AccountNavbar } from '../../features/account/Navbar';
import { AccountLayout } from '../../features/account/Layout';
import { useAtom } from '@reatom/npm-react';
import { currentTeamAtom, teamsAtom } from '../../features/account/model';
import { Settings } from './features/settings/Settings';
import { Members } from './features/members';
import { ToWork } from './features/towork/ToWork';

export function WorkspacePage() {
  const [currentTeam] = useAtom(currentTeamAtom);
  const [teams] = useAtom(teamsAtom);

  if (RD.isLoading(teams)) return;

  if (RD.isSuccess(teams) && teams.data.length === 0) {
    return (
      <AccountLayout key={currentTeam?.id}>
        <AccountNavbar />
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
      </AccountLayout>
    );
  }

  return (
    <AccountLayout key={currentTeam?.id}>
      <AccountNavbar />
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
    </AccountLayout>
  );
}
