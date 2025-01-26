import * as RD from '@young-aviator-club/remote-data';
import {
  Box,
  Button,
  Flex,
  Link as ChakraLink,
  MenuSeparator,
  Spacer,
  HStack,
  MenuItemGroup,
} from '@chakra-ui/react';
import { Avatar } from '@/components/ui/avatar';
import { MenuContent, MenuItem, MenuRoot, MenuTrigger } from '@/components/ui/menu';
import { LuChartBarBig, LuPlus, LuAppWindow } from 'react-icons/lu';
import { Status } from '../../components/ui/status';
import { CreateTeamDialog } from '../teams/CreateTeamDialog';
import { Link, useLocation } from 'wouter';
import { useAction, useAtom } from '@reatom/npm-react';
import { currentTeamAtom, currentTeamIdAtom, teamsAtom } from './model';
import { fetchSignOutAtom, userAtom } from '../auth/model';

const routes = [
  { route: '/workspace', title: 'Workspace', icon: <LuAppWindow /> },
  { route: '/boards', title: 'Boards', icon: <LuChartBarBig /> },
] as const;

export function AccountNavbar() {
  const [location] = useLocation();
  const [user] = useAtom(userAtom);
  const [teams] = useAtom(teamsAtom);
  const [currentTeam] = useAtom(currentTeamAtom);
  const [, setCurrentTeamId] = useAtom(currentTeamIdAtom);
  const signOut = useAction(fetchSignOutAtom);

  const handleChangeTeamClick = (teamId: string) => {
    setCurrentTeamId(teamId);
  };

  const handleSignOutClick = () => {
    signOut();
  };

  return (
    <Box px={4} py={3} shadow="md">
      <Flex alignItems="center">
        <ChakraLink fontWeight="bold" mx={4} asChild>
          <Link to="/">Hotpot</Link>
        </ChakraLink>
        <Flex>
          <MenuRoot size="md">
            {currentTeam && (
              <MenuTrigger>
                <Button variant="outline" size="xs" asChild>
                  <Status value="success">{currentTeam.name}</Status>
                </Button>
              </MenuTrigger>
            )}
            <MenuContent>
              {RD.successOrElse(teams, () => []).map((team) => (
                <MenuItem key={team.id} value={team.id} onClick={() => handleChangeTeamClick(team.id)}>
                  {currentTeam.id === team.id ? <Status value="success">{team.name}</Status> : team.name}
                </MenuItem>
              ))}
              <MenuSeparator />
              <CreateTeamDialog
                opener={
                  <MenuItem value="create">
                    <LuPlus />
                    create team
                  </MenuItem>
                }
              />
            </MenuContent>
          </MenuRoot>

          {routes.map((route) => (
            <ChakraLink
              key={route.route}
              mx={4}
              variant={route.route === location ? 'underline' : undefined}
              asChild
            >
              <Link to={route.route}>{route.title}</Link>
            </ChakraLink>
          ))}
        </Flex>
        <Spacer />
        <HStack>
          <MenuRoot size="md">
            <MenuTrigger>
              <Avatar name={user?.email} size="xs" variant="outline" />
            </MenuTrigger>
            <MenuContent>
              <MenuItemGroup title={user?.email as string}>
                <MenuItem value="logout" onClick={handleSignOutClick}>
                  Logout
                </MenuItem>
              </MenuItemGroup>
            </MenuContent>
          </MenuRoot>
        </HStack>
      </Flex>
    </Box>
  );
}
