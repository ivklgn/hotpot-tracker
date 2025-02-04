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
import { CreateTeamDialog } from '../team/CreateTeamDialog';
import { Link, useLocation } from 'wouter';
import { db } from '../../instantdb';
import { useAccount } from './AccountContext';
import { useEffect, useMemo } from 'react';

const routes = [
  { route: '/workspace', title: 'Workspace', icon: <LuAppWindow /> },
  { route: '/boards', title: 'Boards', icon: <LuChartBarBig /> },
] as const;

export function AccountNavbar() {
  const [location] = useLocation();
  const { user } = db.useAuth();
  const { currentTeamId, setCurrentTeamId } = useAccount();
  const { data: teams } = db.useQuery({ teams: {} });
  const currentSelectedTeam = useMemo(() => {
    if (teams?.teams && teams.teams.length) {
      return currentTeamId ? teams.teams.find((team) => team.id === currentTeamId) : teams.teams?.[0];
    }
    return undefined;
  }, [currentTeamId, teams?.teams]);

  useEffect(() => {
    if (teams?.teams && teams.teams.length && !currentTeamId) {
      setCurrentTeamId(teams.teams[0].id);
    }
  }, [currentTeamId, setCurrentTeamId, teams?.teams]);

  const handleChangeTeamClick = (teamId: string) => {
    setCurrentTeamId(teamId);
  };

  const handleSignOutClick = () => {
    db.auth.signOut();
  };

  return (
    <Box px={4} py={3} shadow="md">
      <Flex alignItems="center">
        <ChakraLink fontWeight="bold" mx={4} asChild>
          <Link to="/">Hotpot</Link>
        </ChakraLink>
        <Flex>
          {currentSelectedTeam && (
            <MenuRoot size="md">
              <MenuTrigger>
                <Button variant="outline" size="xs" asChild>
                  <Status value="success">{currentSelectedTeam.name}</Status>
                </Button>
              </MenuTrigger>
              <MenuContent>
                {teams?.teams?.map((team) => (
                  <MenuItem key={team.id} value={team.id} onClick={() => handleChangeTeamClick(team.id)}>
                    {currentSelectedTeam?.id === team.id ? (
                      <Status value="success">{team.name}</Status>
                    ) : (
                      team.name
                    )}
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
          )}

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
