import {
  Box,
  Flex,
  Link as ChakraLink,
  Button,
  ButtonGroup,
  EmptyState,
  VStack,
  Editable,
  IconButton,
} from '@chakra-ui/react';
import { Link, useLocation } from 'wouter';
import { db } from '../../instantdb';
import { HiColorSwatch } from 'react-icons/hi';
import { id, InstaQLEntity } from '@instantdb/react';
import { useAccount } from '../account/AccountContext';
import { ConfirmAction } from '../../components/ConfirmAction';
import { LuPencilLine, LuX, LuCheck } from 'react-icons/lu';
import { useState } from 'react';
import { Column } from './Column';
import { CreateBoardDialog } from './CreateBoardDialog';
import { AppSchema } from '../../../instant.schema';
import { SmartParams } from '../smart-params';

type BoardViewMode = 'view' | 'edit';

interface BoardProps {
  mode: BoardViewMode;
  board?: InstaQLEntity<AppSchema, 'boards', { smartParams: {} }>;
}

export function Board({ board, mode = 'view' }: BoardProps) {
  const { currentTeamId } = useAccount();
  const { data: columns } = db.useQuery(
    board
      ? {
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
              where: {
                boardId: board.id,
              },
              order: {
                position: 'asc',
              },
            },
          },
        }
      : null
  );

  const handleDragTask = (taskId: string, targetColumnId: string) => {
    changeTaskColumn({ taskId, columnId: targetColumnId });
  };

  const handleDragColumn = ({
    targetIndex,
    replaceToIndex,
    fromColumnId,
    toColumnId,
  }: {
    targetIndex: number;
    replaceToIndex: number;
    fromColumnId: string;
    toColumnId: string;
  }) => {
    changeColumnPosition({
      from: { columnId: fromColumnId, position: targetIndex },
      to: { columnId: toColumnId, position: replaceToIndex },
    });
  };

  if (!board) {
    return (
      <Box flex="1" pt={8} mx={6}>
        <EmptyState.Root>
          <EmptyState.Content>
            <EmptyState.Indicator>
              <HiColorSwatch />
            </EmptyState.Indicator>
            <VStack textAlign="center">
              <EmptyState.Title>Board not found</EmptyState.Title>
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

  if (columns?.columns?.length === 0) {
    return (
      <Box my="2" minHeight="320px" mt="4" key={board.id}>
        <BoardHeader board={board} mode={mode} />
        <Box flex="1" pt={8} mx={6}>
          <EmptyState.Root>
            <EmptyState.Content>
              <EmptyState.Indicator>
                <HiColorSwatch />
              </EmptyState.Indicator>
              <VStack textAlign="center">
                <EmptyState.Title>No columns</EmptyState.Title>
                <EmptyState.Description>Click create button to get started 🚀</EmptyState.Description>
              </VStack>
              <ButtonGroup>
                <Button
                  size="xs"
                  onClick={() => {
                    createColumn({ boardId: board.id, teamId: currentTeamId as string });
                  }}
                >
                  Create column
                </Button>
              </ButtonGroup>
            </EmptyState.Content>
          </EmptyState.Root>
        </Box>
      </Box>
    );
  }

  return (
    <Box my="2" minHeight="320px" mt="4" key={board.id}>
      <BoardHeader board={board} mode={mode} />
      <Flex direction="row" scrollBehavior="smooth" overflowX="scroll" whiteSpace="none" w="100%">
        {columns?.columns.map((column) => (
          <Column column={column} onDrag={handleDragColumn} onDragTask={handleDragTask} key={column.id} />
        ))}
      </Flex>
    </Box>
  );
}

async function createColumn({ boardId, teamId }: { boardId: string; teamId: string }) {
  const columnId = id();
  const { data: columns } = await db.queryOnce({ columns: { $: { where: { boardId } } } });
  const position = (columns?.columns || []).reduce((max, c) => (c.position > max ? c.position : max), 0);

  return await db.transact([
    db.tx.columns[columnId].update({
      boardId,
      teamId,
      createdAt: JSON.stringify(new Date()),
      position: position + 1,
    }),
    db.tx.columns[columnId].link({ boards: boardId }),
    db.tx.columns[columnId].link({ teams: teamId }),
  ]);
}

async function deleteBoard({ boardId }: { boardId: string }) {
  return await db.transact([db.tx.boards[boardId].update({ deletedAt: JSON.stringify(new Date()) })]);
}

interface BoardHeaderProps {
  board?: InstaQLEntity<AppSchema, 'boards', { smartParams: {} }>;
  mode: BoardViewMode;
}

function BoardHeader({ board, mode }: BoardHeaderProps) {
  const [, navigate] = useLocation();
  const { currentTeamId } = useAccount();
  const [name, setName] = useState<string>(board?.name || '');

  const handleRenameBoard = ({ value: newName }: { value: string }) => {
    if (!newName) return;
    renameBoard({ boardId: board?.id as string, newName });
  };

  if (!board) return null;

  return (
    <Flex direction="column" mx={4} gap="2">
      <Flex direction="row" justifyContent="space-between">
        {mode === 'view' && (
          <ChakraLink asChild colorPalette="teal" fontWeight="medium" fontSize="xl">
            <Link to={`/board/${board.id}`}>{board.name}</Link>
          </ChakraLink>
        )}
        {mode === 'edit' && (
          <Editable.Root
            maxW={480}
            value={name}
            onValueChange={(e) => setName(e.value)}
            placeholder="Click to edit"
            onValueCommit={handleRenameBoard}
          >
            <Editable.Preview />
            <Editable.Input />
            <Editable.Control>
              <Editable.EditTrigger asChild>
                <IconButton variant="ghost" size="xs">
                  <LuPencilLine />
                </IconButton>
              </Editable.EditTrigger>
              <Editable.CancelTrigger asChild>
                <IconButton variant="outline" size="xs">
                  <LuX />
                </IconButton>
              </Editable.CancelTrigger>
              <Editable.SubmitTrigger asChild>
                <IconButton variant="outline" size="xs">
                  <LuCheck />
                </IconButton>
              </Editable.SubmitTrigger>
            </Editable.Control>
          </Editable.Root>
        )}
        <ButtonGroup size="xs" variant="outline">
          <Button
            variant="outline"
            onClick={() => {
              createColumn({ boardId: board.id, teamId: currentTeamId as string });
            }}
          >
            Add column
          </Button>
          {mode === 'edit' && (
            <ConfirmAction
              opener={
                <Button variant="outline" colorPalette="red">
                  Delete
                </Button>
              }
              text="Are you sure you want to delete this board?"
              onOk={() => {
                deleteBoard({ boardId: board.id }).then(() => {
                  navigate('/boards');
                });
              }}
            />
          )}
        </ButtonGroup>
      </Flex>
      <SmartParams type="board" smartParams={board.smartParams || []} boardId={board.id} />
    </Flex>
  );
}

async function renameBoard({ newName, boardId }: { boardId: string; newName: string }) {
  return await db.transact([db.tx.boards[boardId].merge({ name: newName })]);
}

async function changeTaskColumn({ taskId, columnId }: { taskId: string; columnId: string }) {
  return await db.transact([
    db.tx.tasks[taskId].merge({ columnId }),
    db.tx.tasks[taskId].link({ columns: columnId }),
  ]);
}

async function changeColumnPosition({
  from,
  to,
}: {
  from: { columnId: string; position: number };
  to: { columnId: string; position: number };
}) {
  return await db.transact([
    db.tx.columns[from.columnId].merge({ position: from.position }),
    db.tx.columns[to.columnId].merge({ position: to.position }),
  ]);
}
