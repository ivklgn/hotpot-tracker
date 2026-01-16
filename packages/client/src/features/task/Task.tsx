import {
  Badge,
  Box,
  Button,
  ButtonGroup,
  Editable,
  EmptyState,
  Flex,
  Group,
  IconButton,
  VStack,
} from '@chakra-ui/react';
import { useState, lazy, Suspense } from 'react';
import { LuPencilLine, LuX, LuCheck } from 'react-icons/lu';
import { db } from '../../instantdb';
import { HiColorSwatch } from 'react-icons/hi';
import { AppSchema } from '@hotpot/shared';
import { InstaQLEntity } from '@instantdb/react';
import { Link, useLocation } from 'wouter';
import { SmartParams } from '../smart-params';
import { JSONContent } from '@tiptap/react';
import { ConfirmAction } from '../../components/ConfirmAction';
import { TaskApprove } from './TaskApprove';
import { runTransaction } from '../../core/instantdb-transaction';
import tariffLimits from '@/tariff-limits.json';
import { Link as ChakraLink } from '@chakra-ui/react';
import { toaster } from '@/utils/toaster';
import { CreateIssueDialog } from '../issue/CreateIssueDialog';

const Editor = lazy(() =>
  import('@/components/Editor/Editor').then((module) => ({ default: module.Editor }))
);

interface TaskProps {
  readonly task?: InstaQLEntity<AppSchema, 'tasks', { smartParams: {}; columns: {} }>;
  readonly board?: InstaQLEntity<AppSchema, 'boards'>;
}

export function Task({ task, board }: TaskProps) {
  const [, navigate] = useLocation();
  const [name, setName] = useState<string>(task?.title || '');
  const { user } = db.useAuth();
  const { data: approvesData } = db.useQuery(
    task?.id
      ? {
          approves: {
            $: {
              where: { taskId: task.id },
            },
          },
        }
      : null
  );
  const [isCreateIssueVisible, setIsCreateIssueVisibility] = useState(false);

  const handleRenameBoard = ({ value: newTitle }: { value: string }): void => {
    if (!newTitle || !task) return;
    runTransaction(
      () => renameTask({ taskId: task.id, newTitle }),
      () => {
        toaster.create({
          title: 'Task renamed',
          type: 'success',
        });
      }
    );
  };

  const handleUpdateContent = (newContent: JSONContent): void => {
    if (!newContent || !task) return;
    const jsonString = JSON.stringify(newContent) as TaskContentJSON;
    const byteLength = new TextEncoder().encode(jsonString).length;

    if (byteLength > tariffLimits.free.max_size_task_content) {
      toaster.create({
        title: `Превышен лимит размера контента: ${tariffLimits.free.max_size_task_content} байт`,
        type: 'error',
      });
      return;
    }

    runTransaction(
      () => updateTaskContent({ taskId: task.id, newContent: jsonString }),
      () => {
        toaster.create({
          title: 'Task saved',
          type: 'success',
        });
      },
      () => {
        toaster.create({
          title: 'Failed to save task',
          type: 'error',
        });
      }
    );
  };

  const handleCreateIssue = (): void => {
    const approveId = approvesData?.approves.find((a) => a.creatorId === user?.id)?.id;
    if (approveId) {
      removeApprove({ approveId });
    }
  };

  const handleCreateCommentIssue = (): void => {
    setIsCreateIssueVisibility(true);
  };

  if (!task) {
    return (
      <Box flex="1" pt={8} mx={6}>
        <EmptyState.Root>
          <EmptyState.Content>
            <EmptyState.Indicator>
              <HiColorSwatch />
            </EmptyState.Indicator>
            <VStack textAlign="center">
              <EmptyState.Title>Task not found</EmptyState.Title>
              <EmptyState.Description>Go to the boards and start a new task in column</EmptyState.Description>
            </VStack>
            <ButtonGroup>
              <Button onClick={() => navigate('/boards')}>Go to boards</Button>
            </ButtonGroup>
          </EmptyState.Content>
        </EmptyState.Root>
      </Box>
    );
  }

  return (
    <Box flex="1" pt={8} mx={6}>
      <Flex direction="row" justifyContent="space-between" gap={4} mb={4}>
        <Editable.Root
          value={name}
          onValueChange={(e) => setName(e.value)}
          placeholder="Click to edit"
          onValueCommit={handleRenameBoard}
          wordBreak="break-word"
          maxLength={120}
        >
          <Editable.Preview fontSize="md" fontWeight="bold" />
          <Editable.Input fontSize="xs" fontWeight="bold" />
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
        <ButtonGroup size="xs">
          {!!board?.name && (
            <Group attached>
              <Badge variant="outline" height="32px">
                Board
              </Badge>
              <Badge variant="outline" height="32px">
                <ChakraLink asChild colorPalette="teal" fontWeight="medium" wordBreak="break-word">
                  <Link to={`/board/${board.id}`}>{board.name}</Link>
                </ChakraLink>
              </Badge>
            </Group>
          )}
          <TaskApprove task={task} />
          <DeleteTaskActions task={task} />
        </ButtonGroup>
      </Flex>

      <Box mb={4}>
        <SmartParams
          type="task"
          smartParams={task.smartParams || []}
          taskId={task.id}
          taskBoardId={task.columns?.boardId}
        />
      </Box>

      <Suspense fallback={null}>
        <Editor
          originalContent={task.content}
          onSaveClick={handleUpdateContent}
          onCreateInlineIssue={handleCreateIssue}
          onCreateCommentIssue={handleCreateCommentIssue}
        />
      </Suspense>
      <CreateIssueDialog
        visible={isCreateIssueVisible}
        taskId={task.id}
        onCreate={handleCreateIssue}
        onClose={() => setIsCreateIssueVisibility(false)}
      />
    </Box>
  );
}

function DeleteTaskActions({ task }: { task?: InstaQLEntity<AppSchema, 'tasks'> }) {
  const [, navigate] = useLocation();

  if (!task) return null;

  if (!task?.deletedAt) {
    return (
      <ConfirmAction
        key={`${task.id}_${task.deletedAt}`}
        opener={
          <Button variant="outline" colorPalette="red">
            Archive
          </Button>
        }
        text="Are you sure you want to archive this task?"
        onOk={() => {
          runTransaction(
            () => archiveTask({ taskId: task.id }),
            () => {
              toaster.create({
                title: 'Task archived',
                type: 'success',
              });
            }
          );
        }}
      />
    );
  }

  return (
    <>
      <ConfirmAction
        key={`archive_${task.id}_${task.deletedAt}`}
        opener={
          <Button variant="outline" colorPalette="red">
            Move from archive
          </Button>
        }
        text="Task will return from archive"
        onOk={() => {
          runTransaction(() => undoArchiveTask({ taskId: task.id }));
        }}
      />
      <ConfirmAction
        key={`delete_${task.id}_${task.deletedAt}`}
        opener={
          <Button colorPalette="red" variant="solid">
            Delete
          </Button>
        }
        text="Are you sure you want to delete this task? All content will be deleted. This action cannot be undone."
        onOk={() => {
          runTransaction(
            () => deleteTask({ taskId: task.id }),
            () => {
              toaster.create({
                title: 'Task deleted',
                type: 'success',
              });
              navigate('/boards');
            }
          );
        }}
      />
    </>
  );
}

async function renameTask({ newTitle, taskId }: { taskId: string; newTitle: string }): Promise<void> {
  await db.transact([db.tx.tasks[taskId].merge({ updatedAt: new Date().toJSON(), title: newTitle })]);
}

export async function updateTaskContent({
  newContent,
  taskId,
}: {
  taskId: string;
  newContent: TaskContentJSON;
}): Promise<void> {
  await db.transact([db.tx.tasks[taskId].merge({ updatedAt: new Date().toJSON(), content: newContent })]);
}

async function archiveTask({ taskId }: { taskId: string }): Promise<void> {
  await db.transact([
    db.tx.tasks[taskId].update({ updatedAt: new Date().toJSON(), deletedAt: new Date().toJSON() }),
  ]);
}

async function deleteTask({ taskId }: { taskId: string }): Promise<void> {
  await db.transact([db.tx.tasks[taskId].delete()]);
}

async function undoArchiveTask({ taskId }: { taskId: string }): Promise<void> {
  await db.transact([db.tx.tasks[taskId].update({ updatedAt: new Date().toJSON(), deletedAt: null })]);
}

async function removeApprove({ approveId }: { approveId: string }): Promise<void> {
  await db.transact(db.tx.approves[approveId].delete());
}
