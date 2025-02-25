import { Box, Button, ButtonGroup, Editable, EmptyState, IconButton, VStack } from '@chakra-ui/react';
import { useState } from 'react';
import { LuPencilLine, LuX, LuCheck } from 'react-icons/lu';
import { db } from '../../instantdb';
import { HiColorSwatch } from 'react-icons/hi';
import { AppSchema } from '../../../instant.schema';
import { InstaQLEntity } from '@instantdb/react';
import { useLocation } from 'wouter';
import { SmartParams } from '../smart-params';

interface TaskProps {
  task?: InstaQLEntity<AppSchema, 'tasks', { smartParams: {} }>;
}

export function Task({ task }: TaskProps) {
  const [, navigate] = useLocation();
  const [name, setName] = useState<string>(task?.title || '');

  const handleRenameBoard = ({ value: newTitle }: { value: string }) => {
    if (!newTitle || !task) return;
    renameTask({ taskId: task.id, newTitle });
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
      <SmartParams type="task" smartParams={task.smartParams || []} taskId={task.id} />
      <div>(Content)</div>
    </Box>
  );
}

async function renameTask({ newTitle, taskId }: { taskId: string; newTitle: string }) {
  return await db.transact([db.tx.tasks[taskId].merge({ title: newTitle })]);
}
