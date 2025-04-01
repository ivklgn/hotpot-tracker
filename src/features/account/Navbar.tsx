import {
  Box,
  Button,
  Flex,
  Link as ChakraLink,
  MenuSeparator,
  Spacer,
  HStack,
  MenuItemGroup,
  Menu,
} from '@chakra-ui/react';
import { MenuContent, MenuItem, MenuRoot, MenuTrigger } from '@/components/ui/menu';
import { LuChartBarBig, LuPlus, LuAppWindow, LuSearch } from 'react-icons/lu';
import { Status } from '../../components/ui/status';
import { CreateTeamDialog } from '../team/CreateTeamDialog';
import { Link, useLocation } from 'wouter';
import { db } from '../../instantdb';
import { useAccount } from './AccountContext';
import { useEffect, useMemo, useState } from 'react';
import { UserAvatar } from '../../components/Avatars';

const ROUTES = [
  { route: '/workspace', title: 'Workspace', icon: <LuAppWindow /> },
  { route: '/boards', title: 'Boards', icon: <LuChartBarBig /> },
  { route: '/search', title: 'Search', icon: <LuSearch /> },
] as const;

export function AccountNavbar() {
  const [location, navigate] = useLocation();
  const { user } = db.useAuth();
  const { currentTeamId, setCurrentTeamId } = useAccount();
  const { data: teams } = db.useQuery({ teams: {} });
  const [isCreateTeamDialogVisible, setCreateTeamDialogVisibility] = useState(false);

  const routes = useMemo(() => {
    if (!teams?.teams || (teams?.teams && teams.teams.length === 0)) {
      return ROUTES.filter((route) => route.route === '/workspace');
    }
    return ROUTES;
  }, [teams?.teams]);

  const currentSelectedTeam = useMemo(() => {
    if (teams?.teams && teams.teams.length > 0) {
      return currentTeamId ? teams.teams.find((team) => team.id === currentTeamId) : teams.teams?.[0];
    }
    return undefined;
  }, [currentTeamId, teams?.teams]);

  useEffect(() => {
    if (!teams?.teams) return;
    if (teams.teams.length > 0) {
      if (currentTeamId && !teams.teams.find((team) => team.id === currentTeamId)) {
        setCurrentTeamId(undefined);
      } else if (!currentTeamId && teams.teams.length > 0) {
        setCurrentTeamId(teams.teams[0].id);
      }
    }
  }, [currentTeamId, teams?.teams]);

  const handleSignOutClick = () => {
    db.auth.signOut().then(() => {
      navigate('/');
    });
  };

  return (
    <Box px={4} py={3} shadow="md" key={currentTeamId}>
      <Flex alignItems="center">
        <ChakraLink fontWeight="bold" mx={4} asChild>
          <Link to="/">Hotpot</Link>
        </ChakraLink>

        <Flex>
          {currentSelectedTeam && (
            <MenuRoot
              size="md"
              onSelect={(details) => {
                if (details.value === 'create') {
                  setCreateTeamDialogVisibility(true);
                } else {
                  setCurrentTeamId(details.value as string);
                }
              }}
            >
              <MenuTrigger>
                <Button variant="outline" size="xs" asChild>
                  <Status value="success">{currentSelectedTeam?.name}</Status>
                </Button>
              </MenuTrigger>
              <MenuContent>
                {teams?.teams?.map((team) => (
                  <MenuItem key={team.id} value={team.id}>
                    {currentSelectedTeam?.id === team.id ? (
                      <Status value="success">{team.name}</Status>
                    ) : (
                      team.name
                    )}
                  </MenuItem>
                ))}
                <MenuSeparator />
                <MenuItem value="create">
                  <LuPlus />
                  create team
                </MenuItem>
              </MenuContent>
            </MenuRoot>
          )}

          <CreateTeamDialog
            isOpen={isCreateTeamDialogVisible}
            onClose={() => {
              setCreateTeamDialogVisibility(false);
            }}
          />

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
              <UserAvatar user={{ userId: user?.id as string, userEmail: user?.email as string }} size="xs" />
            </MenuTrigger>
            <MenuContent>
              <MenuItemGroup>
                <Menu.ItemGroupLabel>{user?.email as string}</Menu.ItemGroupLabel>
                <MenuItem value="logout" onClick={handleSignOutClick} cursor="pointer">
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
