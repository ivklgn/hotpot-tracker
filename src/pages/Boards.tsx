import { Badge, Box, Card, Flex, Heading, Stack } from '@chakra-ui/react';
import { AccountNavbar } from '../features/account/Navbar';

export function BoardsPage() {
  return (
    <Flex direction="column" minH="100vh">
      <AccountNavbar />
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
