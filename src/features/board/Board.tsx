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
import { id, InstaQLEntity, InstaQLResult } from '@instantdb/react';
import { useAccount } from '../account/AccountContext';
import { ConfirmAction } from '../../components/ConfirmAction';
import { LuPencilLine, LuX, LuCheck, LuWand } from 'react-icons/lu';
import { useState } from 'react';
import { Column, ColumnType } from './Column';
import { CreateBoardDialog } from './CreateBoardDialog';
import { AppSchema } from '../../../instant.schema';
import { SmartParams } from '../smart-params';
import { runTransaction } from '../../core/instantdb-transaction';
import { createEvent } from '../events';
import { toaster } from '../../components/ui/toaster';
import tariffLimits from '../../../tariff-limits.json';
import { AIReport } from '../ai/AIReport';

type BoardViewMode = 'view' | 'edit';

interface BoardProps {
  mode: BoardViewMode;
  board?: InstaQLEntity<
    AppSchema,
    'boards',
    {
      smartParams: {};
      columns: {
        tasks: {
          smartParams: {};
          approves: {};
        };
        statuses: {};
        contributors: {
          memberships: {};
        };
      };
    }
  >;
}

export function Board({ board, mode = 'view' }: BoardProps) {
  const { currentTeamId } = useAccount();

  const handleDragTask = (
    task: InstaQLEntity<AppSchema, 'tasks'>,
    targetColumn: ColumnType,
    currentColumnId?: string
  ) => {
    runTransaction(() => changeTaskColumn({ taskId: task.id, columnId: targetColumn.id }));

    if (targetColumn.contributors && targetColumn.contributors.length > 0) {
      targetColumn.contributors.forEach((contributor) => {
        runTransaction(() =>
          createEvent({
            type: 'review-task',
            payload: { taskId: task.id, taskTitle: task.title },
            teamId: currentTeamId as string,
            membershipId: contributor.membershipId,
          })
        );
      });
    }

    const taskApprovesFromCurrentColumn = board?.columns
      ?.find((c) => c.id === currentColumnId)
      ?.tasks.find((t) => t.id === task.id)
      ?.approves.map((a) => a.id);

    if (taskApprovesFromCurrentColumn?.length) {
      runTransaction(() => removeApproves({ approvesIds: taskApprovesFromCurrentColumn }));
    }
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
    runTransaction(() =>
      changeColumnPosition({
        from: { columnId: fromColumnId, position: targetIndex },
        to: { columnId: toColumnId, position: replaceToIndex },
      })
    );
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

  if (board?.columns?.length === 0) {
    return (
      <Box my="2" minHeight="320px" mt="4" key={board.id}>
        <BoardHeader board={board} mode={mode} columns={board?.columns} />
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
                    runTransaction(() =>
                      createColumn({
                        boardId: board.id,
                        teamId: currentTeamId as string,
                        position:
                          (board?.columns?.reduce((max, c) => (c.position > max ? c.position : max), 0) ||
                            0) + 1,
                      })
                    );
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
      <BoardHeader board={board} mode={mode} columns={board?.columns} />
      <Flex direction="row" scrollBehavior="smooth" overflowX="scroll" whiteSpace="none" w="100%">
        {board?.columns?.map((column) => (
          <Column column={column} onDrag={handleDragColumn} onDragTask={handleDragTask} key={column.id} />
        ))}
      </Flex>
    </Box>
  );
}

async function createColumn({
  boardId,
  teamId,
  creatorId,
  position,
}: {
  boardId: string;
  teamId: string;
  position: number;
  creatorId?: string;
}) {
  const columnId = id();
  return await db.transact([
    db.tx.columns[columnId].update({
      updatedAt: new Date().toJSON(),
      boardId,
      teamId,
      position,
      createdAt: new Date().toJSON(),
      creatorId,
    }),
    db.tx.columns[columnId].link({ boards: boardId }),
    db.tx.columns[columnId].link({ teams: teamId }),
  ]);
}

interface BoardHeaderProps {
  board?: InstaQLEntity<AppSchema, 'boards', { smartParams: {} }>;
  columns?: InstaQLResult<AppSchema, { columns: {} }>['columns'];
  mode: BoardViewMode;
}

function BoardHeader({ board, mode, columns }: BoardHeaderProps) {
  const { currentTeamId } = useAccount();
  const [name, setName] = useState<string>(board?.name || '');
  const { user } = db.useAuth();

  const handleRenameBoard = ({ value: newName }: { value: string }) => {
    if (!newName) return;
    runTransaction(() => renameBoard({ boardId: board?.id as string, newName }));
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
          <AIReport boardId={board.id} />
          <Button
            variant="outline"
            onClick={() => {
              runTransaction(
                () =>
                  createColumn({
                    boardId: board.id,
                    teamId: currentTeamId as string,
                    creatorId: user?.id,
                    position:
                      (columns?.reduce((max, c) => (c.position > max ? c.position : max), 0) || 0) + 1,
                  }),
                (result) => {
                  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
                  // @ts-expect-error
                  if (result.isErr() && result.error.originalError?.hint?.expected === 'perms-pass?') {
                    toaster.create({
                      title: `Maximum ${tariffLimits.free.max_columns_per_board} columns allowed`,
                      type: 'error',
                    });
                  }
                }
              );
            }}
          >
            Add column
          </Button>
          {mode === 'edit' && <DeleteBoardActions board={board} />}
        </ButtonGroup>
      </Flex>
      <SmartParams type="board" smartParams={board.smartParams || []} boardId={board.id} />
    </Flex>
  );
}

function DeleteBoardActions({ board }: { board?: InstaQLEntity<AppSchema, 'boards'> }) {
  const [, navigate] = useLocation();

  if (!board) return null;

  if (!board?.deletedAt) {
    return (
      <ConfirmAction
        key={`${board.id}_${board.deletedAt}`}
        opener={
          <Button variant="outline" colorPalette="red">
            Archive
          </Button>
        }
        text="Are you sure you want to archive this board?"
        onOk={() => {
          runTransaction(() => archiveBoard({ boardId: board.id }));
        }}
      />
    );
  }

  return [
    <ConfirmAction
      key={`${board.id}_${board.deletedAt}`}
      opener={
        <Button variant="outline" colorPalette="red">
          Move from archive
        </Button>
      }
      text="Borad will return from archive"
      onOk={() => {
        runTransaction(() => undoArchiveBoard({ boardId: board.id }));
      }}
    />,
    <ConfirmAction
      key={`board.id_${board.deletedAt}`}
      opener={
        <Button colorPalette="red" variant="solid">
          Delete
        </Button>
      }
      text="Are you sure you want to delete this board? All columns will be deleted. This action cannot be undone."
      onOk={() => {
        runTransaction(
          () => deleteBoard({ boardId: board.id }),
          (result) => {
            if (result.isOk()) {
              navigate('/boards');
            }
          }
        );
      }}
    />,
  ];
}

async function removeApproves({ approvesIds }: { approvesIds: string[] }) {
  return await db.transact(approvesIds.map((ai) => db.tx.approves[ai].delete()));
}

async function archiveBoard({ boardId }: { boardId: string }) {
  return await db.transact([
    db.tx.boards[boardId].update({ updatedAt: new Date().toJSON(), deletedAt: new Date().toJSON() }),
  ]);
}

async function deleteBoard({ boardId }: { boardId: string }) {
  return await db.transact([db.tx.boards[boardId].delete()]);
}

async function undoArchiveBoard({ boardId }: { boardId: string }) {
  return await db.transact([
    db.tx.boards[boardId].update({ updatedAt: new Date().toJSON(), deletedAt: undefined }),
  ]);
}

async function renameBoard({ newName, boardId }: { boardId: string; newName: string }) {
  return await db.transact([db.tx.boards[boardId].merge({ updatedAt: new Date().toJSON(), name: newName })]);
}

async function changeTaskColumn({ taskId, columnId }: { taskId: string; columnId: string }) {
  return await db.transact([
    db.tx.tasks[taskId].merge({ updatedAt: new Date().toJSON(), columnId }),
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
    db.tx.columns[from.columnId].merge({ updatedAt: new Date().toJSON(), position: from.position }),
    db.tx.columns[to.columnId].merge({ updatedAt: new Date().toJSON(), position: to.position }),
  ]);
}
