import { Button, ButtonGroup, EmptyState, Stack, VStack } from '@chakra-ui/react';
import { HiColorSwatch } from 'react-icons/hi';
import { CreateBoardDialog } from '../../features/board/CreateBoardDialog';
import { db } from '../../instantdb';
import { useAccount } from '../../features/account/AccountContext';
import { Board } from '../../features/board/Board';
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import { SegmentedControl } from '../../components/ui/segmented-control';
import { useState } from 'react';
import Helm from '../../components/Helm';

export function BoardsPage() {
  const { currentTeamId } = useAccount();
  const { user } = db.useAuth();
  const [boardFilter, setBoardFilter] = useState('all');
  const { data: boards } = db.useQuery({
    boards: {
      columns: {
        tasks: {
          smartParams: {},
          approves: {},
          $: {
            where: {
              deletedAt: {
                $isNull: true,
              },
            },
          },
        },
        statuses: {
          $: {
            where: {
              deletedAt: {
                $isNull: true,
              },
            },
          },
        },
        contributors: {
          memberships: {},
        },
        $: {
          order: {
            position: 'asc',
          },
        },
      },
      smartParams: {},
      $: {
        where: {
          // eslint-disable-next-line @typescript-eslint/ban-ts-comment
          // @ts-expect-error
          creatorId: boardFilter === 'all' ? undefined : (user?.id as string),
          teamId: currentTeamId as string,
          deletedAt: {
            $isNull: true,
          },
        },
      },
    },
  });

  if (!boards) return null;

  return (
    <DndProvider backend={HTML5Backend}>
      <Helm title="Boards" />
      <Stack direction="row" m={4} mt={4}>
        <VStack align="flex-start">
          <SegmentedControl
            size="sm"
            value={boardFilter}
            items={[
              { label: 'All', value: 'all' },
              { label: 'My', value: 'my' },
            ]}
            onValueChange={(value) => {
              setBoardFilter(value.value);
            }}
          />
        </VStack>
        <CreateBoardDialog opener={<Button size="xs">Create board</Button>} />
      </Stack>
      {boards?.boards &&
        boards?.boards?.length > 0 &&
        // TODO: creatorId affect =\
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-expect-error
        boards?.boards?.map((board) => <Board board={board} key={board.id} mode="view" />)}
      {boards?.boards && boards?.boards?.length === 0 && (
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
      )}
    </DndProvider>
  );
}
