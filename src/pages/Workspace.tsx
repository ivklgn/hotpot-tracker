import { Avatar } from '@/components/ui/avatar';
import {
  Box,
  Button,
  Card,
  Flex,
  Heading,
  HStack,
  Link,
  MenuSeparator,
  Spacer,
  Stack,
} from '@chakra-ui/react';
import { MenuContent, MenuItem, MenuItemGroup, MenuRoot, MenuTrigger } from '@/components/ui/menu';
import { db } from '../instantdb';
import { LuUser, LuChartBarBig, LuPlus } from 'react-icons/lu';
import { Badge } from '@chakra-ui/react';
import { Status } from '../components/ui/status';
import { CreateTeamDialog } from '../features/teams/CreateTeamDialog';

// TODO: if teams == 0 - fatal? or == 2 fatal too
// TODO: current team id in localstorage or cookie (persisted)
// by default select first or show start page (empty state)

export function WorkspacePage() {
  const { user } = db.useAuth();
  const { data: teams } = db.useQuery({ teams: {} });

  const handleSignOutClick = () => {
    db.auth.signOut();
  };

  return (
    <Flex direction="column" minH="100vh">
      <Box px={4} py={3} shadow="md">
        <Flex alignItems="center">
          <Link href="#" fontWeight="bold" mx={4}>
            Hotpot
          </Link>
          <Flex>
            <MenuRoot size="md">
              <MenuTrigger>
                <Button variant="outline" size="xs">
                  <Status value="success">team 1</Status>
                </Button>
              </MenuTrigger>
              <MenuContent>
                {teams?.teams.map((team) => (
                  <MenuItem key={team.id} value={team.id}>
                    {team.name}
                  </MenuItem>
                ))}
                {/* <Status value="success">team 1</Status> */}
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
            <Link href="#" mx={4} variant="underline">
              <LuUser />
              Workspace
            </Link>
            <Link href="#" mx={4}>
              <LuChartBarBig />
              Boards
            </Link>
          </Flex>
          <Spacer />
          <HStack>
            <MenuRoot size="md">
              <MenuTrigger>
                <Avatar name={user?.email} size="xs" variant="outline" />
              </MenuTrigger>
              <MenuContent>
                <MenuItemGroup title={user?.email}>
                  <MenuItem value="logout" onClick={handleSignOutClick}>
                    Logout
                  </MenuItem>
                </MenuItemGroup>
              </MenuContent>
            </MenuRoot>
          </HStack>
        </Flex>
      </Box>
      <Box flex="1" pt={8} mx={6}>
        <Stack>
          <Card.Root size="sm">
            <Card.Header>
              <Heading size="md">12312312312312312312312312313223</Heading>
            </Card.Header>
            <Card.Body color="fg.muted">
              <Stack direction="row">
                <Badge colorPalette="green">Success</Badge>
              </Stack>
            </Card.Body>
          </Card.Root>
        </Stack>
      </Box>
    </Flex>
  );
}
