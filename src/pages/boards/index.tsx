import { Box, Button, ButtonGroup, EmptyState, Stack, VStack } from '@chakra-ui/react';
import { HiColorSwatch } from 'react-icons/hi';
import { CreateBoardDialog } from '../../features/board/CreateBoardDialog';
import { db } from '../../instantdb';
import { useAccount } from '../../features/account/AccountContext';
import { Board } from '../../features/board/Board';
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import { SegmentedControl } from '../../components/ui/segmented-control';

export function BoardsPage() {
  const { currentTeamId } = useAccount();
  const { data: boards } = db.useQuery({
    boards: {
      smartParams: {},
      $: {
        where: {
          teamId: currentTeamId as string,
          deletedAt: {
            $isNull: true,
          },
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
    <DndProvider backend={HTML5Backend}>
      <Stack direction="row" m={4} mt={4}>
        <VStack align="flex-start">
          <SegmentedControl size="sm" defaultValue="All" items={['All', 'My', 'Favorites']} />
          {/* <Text>size = </Text> */}
        </VStack>
        <CreateBoardDialog opener={<Button size="xs">Create board</Button>} />
      </Stack>
      {boards?.boards?.map((board) => <Board board={board} key={board.id} mode="view" />)}
    </DndProvider>
  );
}
