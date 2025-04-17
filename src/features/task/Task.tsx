import { Box, Button, ButtonGroup, Editable, EmptyState, Flex, IconButton, VStack } from '@chakra-ui/react';
import { useState, lazy, Suspense } from 'react';
import { LuPencilLine, LuX, LuCheck } from 'react-icons/lu';
import { db } from '../../instantdb';
import { HiColorSwatch } from 'react-icons/hi';
import { AppSchema } from '../../../instant.schema';
import { InstaQLEntity } from '@instantdb/react';
import { useLocation } from 'wouter';
import { SmartParams } from '../smart-params';
import { JSONContent } from '@tiptap/react';
import { ConfirmAction } from '../../components/ConfirmAction';
import { TaskApprove } from './TaskApprove';
import { runTransaction } from '../../core/instantdb-transaction';

const Editor = lazy(() =>
  import('@/components/Editor/Editor').then((module) => ({ default: module.Editor }))
);

interface TaskProps {
  task?: InstaQLEntity<AppSchema, 'tasks', { smartParams: {}; columns: {} }>;
}

export function Task({ task }: TaskProps) {
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

  const handleRenameBoard = ({ value: newTitle }: { value: string }) => {
    if (!newTitle || !task) return;
    runTransaction(() => renameTask({ taskId: task.id, newTitle }));
  };

  const handleUpdateContent = (newContent: JSONContent) => {
    if (!newContent || !task) return;
    runTransaction(() => updateTaskContent({ taskId: task.id, newContent: JSON.stringify(newContent) }));
  };

  const handleCreateIssue = () => {
    const approveId = approvesData?.approves.find((a) => a.creatorId === user?.id)?.id;
    if (approveId) {
      removeApprove({ approveId });
    }
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
      <Flex direction="row" justifyContent="space-between">
        <Editable.Root
          value={name}
          onValueChange={(e) => setName(e.value)}
          placeholder="Click to edit"
          onValueCommit={handleRenameBoard}
          mb={8}
        >
          <Editable.Preview fontSize="3xl" fontWeight="bold" />
          <Editable.Input fontSize="3xl" fontWeight="bold" />
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
          <TaskApprove task={task} />
          <DeleteTaskActions task={task} />
        </ButtonGroup>
      </Flex>

      <SmartParams
        type="task"
        smartParams={task.smartParams || []}
        taskId={task.id}
        taskBoardId={task.columns?.boardId}
      />

      <Suspense fallback={null}>
        <Editor
          originalContent={task.content}
          onSaveClick={handleUpdateContent}
          onCreateIssue={handleCreateIssue}
        />
      </Suspense>
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
          runTransaction(() => archiveTask({ taskId: task.id }));
        }}
      />
    );
  }

  return [
    <ConfirmAction
      key={`${task.id}_${task.deletedAt}`}
      opener={
        <Button variant="outline" colorPalette="red">
          Move from archive
        </Button>
      }
      text="Task will return from archive"
      onOk={() => {
        runTransaction(() => undoArchiveTask({ taskId: task.id }));
      }}
    />,
    <ConfirmAction
      key={`${task.id}_${task.deletedAt}`}
      opener={
        <Button colorPalette="red" variant="solid">
          Delete
        </Button>
      }
      text="Are you sure you want to delete this task? All content will be deleted. This action cannot be undone."
      onOk={() => {
        runTransaction(
          () => deleteTask({ taskId: task.id }),
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

async function renameTask({ newTitle, taskId }: { taskId: string; newTitle: string }) {
  return await db.transact([db.tx.tasks[taskId].merge({ updatedAt: new Date().toJSON(), title: newTitle })]);
}

export async function updateTaskContent({ newContent, taskId }: { taskId: string; newContent: string }) {
  return await db.transact([
    db.tx.tasks[taskId].merge({ updatedAt: new Date().toJSON(), content: newContent }),
  ]);
}

async function archiveTask({ taskId }: { taskId: string }) {
  return await db.transact([
    db.tx.tasks[taskId].update({ updatedAt: new Date().toJSON(), deletedAt: new Date().toJSON() }),
  ]);
}

async function deleteTask({ taskId }: { taskId: string }) {
  return await db.transact([db.tx.tasks[taskId].delete()]);
}

async function undoArchiveTask({ taskId }: { taskId: string }) {
  return await db.transact([
    db.tx.tasks[taskId].update({ updatedAt: new Date().toJSON(), deletedAt: undefined }),
  ]);
}

async function removeApprove({ approveId }: { approveId: string }) {
  return await db.transact(db.tx.approves[approveId].delete());
}
