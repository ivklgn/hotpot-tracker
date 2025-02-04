import {
  Badge,
  Box,
  Button,
  ButtonGroup,
  EmptyState,
  Flex,
  Heading,
  Link,
  Stack,
  Text,
  VStack,
} from '@chakra-ui/react';
import { HiColorSwatch } from 'react-icons/hi';
import { CreateBoardDialog } from './features/CreateBoardDialog';
import { db } from '../../instantdb';
import { useAccount } from '../../features/account/AccountContext';

export function BoardsPage() {
  const { currentTeamId } = useAccount();
  const { data: boards } = db.useQuery({
    boards: {
      $: {
        where: {
          teamId: currentTeamId as string,
        },
      },
    },
  });

  if (!boards) return null;

  if (boards?.boards?.length === 0) {
    return (
      <Box flex="1" pt={8} mx={6}>
        <EmptyState.Root>
          <EmptyState.Content>
            <EmptyState.Indicator>
              <HiColorSwatch />
            </EmptyState.Indicator>
            <VStack textAlign="center">
              <EmptyState.Title>No boards</EmptyState.Title>
              <EmptyState.Description>Click create button to get started 🚀</EmptyState.Description>
            </VStack>
            <ButtonGroup>
              <CreateBoardDialog opener={<Button size="xs">Create board</Button>} />
            </ButtonGroup>
          </EmptyState.Content>
        </EmptyState.Root>
      </Box>
    );
  }

  return (
    <>
      {boards?.boards?.map((board) => (
        <Box my="2" minHeight="320px" mt="4" key={board.id}>
          <Link href="#" ml="4" colorPalette="teal" fontWeight="medium" fontSize="xl">
            {board.name}
          </Link>
          <Flex direction="row">
            <Box
              ml={4}
              bg="bg"
              shadow="md"
              borderRadius="md"
              my="4"
              minHeight="320px"
              w="380px"
              scrollBehavior="smooth"
            >
              <Heading size="md" ml="2" mt="2">
                Column title
              </Heading>
              <Flex direction="column" p="2" gap="2" maxH="480px" overflowY="scroll">
                <Box bg="bg" shadow="md" borderRadius="md" mb="2" p="2">
                  <Text fontWeight="medium" mb="2">
                    Sphinx of black quartz, judge my vow. Sphinx of black quartz, judge my vow.
                  </Text>
                  <Stack direction="row">
                    <Badge colorPalette="green">Outline</Badge>
                    <Badge variant="outline">Solid</Badge>
                  </Stack>
                </Box>
                <Box bg="bg" shadow="md" borderRadius="md" mb="2" p="2">
                  <Text fontWeight="medium" mb="2">
                    Sphinx of black quartz, judge my vow. Sphinx of black quartz, judge my vow.
                  </Text>
                  <Stack direction="row">
                    <Badge colorPalette="green">Outline</Badge>
                    <Badge variant="outline">Solid</Badge>
                  </Stack>
                </Box>
                <Box bg="bg" shadow="md" borderRadius="md" mb="2" p="2">
                  <Text fontWeight="medium" mb="2">
                    Sphinx of black quartz, judge my vow. Sphinx of black quartz, judge my vow.
                  </Text>
                  <Stack direction="row">
                    <Badge colorPalette="green">Outline</Badge>
                    <Badge variant="outline">Solid</Badge>
                  </Stack>
                </Box>
                <Box bg="bg" shadow="md" borderRadius="md" mb="2" p="2">
                  <Text fontWeight="medium" mb="2">
                    Sphinx of black quartz, judge my vow. Sphinx of black quartz, judge my vow.
                  </Text>
                  <Stack direction="row">
                    <Badge colorPalette="green">Outline</Badge>
                    <Badge variant="outline">Solid</Badge>
                  </Stack>
                </Box>
                <Box bg="bg" shadow="md" borderRadius="md" mb="2" p="2">
                  <Text fontWeight="medium" mb="2">
                    Sphinx of black quartz, judge my vow. Sphinx of black quartz, judge my vow.
                  </Text>
                  <Stack direction="row">
                    <Badge colorPalette="green">Outline</Badge>
                    <Badge variant="outline">Solid</Badge>
                  </Stack>
                </Box>
                <Box bg="bg" shadow="md" borderRadius="md" mb="2" p="2">
                  <Text fontWeight="medium" mb="2">
                    Sphinx of black quartz, judge my vow. Sphinx of black quartz, judge my vow.
                  </Text>
                  <Stack direction="row">
                    <Badge colorPalette="green">Outline</Badge>
                    <Badge variant="outline">Solid</Badge>
                  </Stack>
                </Box>
              </Flex>
            </Box>
          </Flex>
        </Box>
      ))}
      <Stack direction="row" h="10" mx={4}>
        <CreateBoardDialog opener={<Button size="xs">Create board</Button>} />
      </Stack>
    </>
  );
}
