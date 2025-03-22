import { Box, Button, ButtonGroup, Editable, EmptyState, Flex, IconButton, VStack } from '@chakra-ui/react';
import { useState } from 'react';
import { LuPencilLine, LuX, LuCheck } from 'react-icons/lu';
import { db } from '../../instantdb';
import { HiColorSwatch } from 'react-icons/hi';
import { AppSchema } from '../../../instant.schema';
import { InstaQLEntity } from '@instantdb/react';
import { useLocation } from 'wouter';
import { SmartParams } from '../smart-params';
import { Editor } from '@/components/Editor/Editor';
import { JSONContent } from '@tiptap/react';
import { ConfirmAction } from '../../components/ConfirmAction';
import { TaskApprove } from './TaskApprove';
import { runTransaction } from '../../core/instantdb-transaction';

interface TaskProps {
  task?: InstaQLEntity<AppSchema, 'tasks', { smartParams: {}; columns: {} }>;
}

export function Task({ task }: TaskProps) {
  const [, navigate] = useLocation();
  const [name, setName] = useState<string>(task?.title || '');

  const handleRenameBoard = ({ value: newTitle }: { value: string }) => {
    if (!newTitle || !task) return;
    runTransaction(() => renameTask({ taskId: task.id, newTitle }));
  };

  const handleUpdateContent = (newContent: JSONContent) => {
    if (!newContent || !task) return;
    runTransaction(() => updateTaskContent({ taskId: task.id, newContent: JSON.stringify(newContent) }));
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
          maxW={480}
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
          <ConfirmAction
            opener={
              <Button variant="outline" colorPalette="red">
                Delete
              </Button>
            }
            text="Are you sure you want to delete task? All content will be removed."
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
          />
        </ButtonGroup>
      </Flex>

      <SmartParams
        type="task"
        smartParams={task.smartParams || []}
        taskId={task.id}
        taskBoardId={task.columns?.boardId}
      />

      <Editor originalContent={task.content} onSaveClick={handleUpdateContent} />
    </Box>
  );
}

async function deleteTask({ taskId }: { taskId: string }) {
  return await db.transact([db.tx.tasks[taskId].update({ deletedAt: new Date().toJSON() })]);
}

async function renameTask({ newTitle, taskId }: { taskId: string; newTitle: string }) {
  return await db.transact([db.tx.tasks[taskId].merge({ title: newTitle })]);
}

async function updateTaskContent({ newContent, taskId }: { taskId: string; newContent: string }) {
  return await db.transact([db.tx.tasks[taskId].merge({ content: newContent })]);
}
