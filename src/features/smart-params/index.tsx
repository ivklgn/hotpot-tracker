import { HStack, Tag, IconButton, Text } from '@chakra-ui/react';
import { LuCalendar, LuTimer, LuPencilLine, LuCaseLower } from 'react-icons/lu';
import { SmartParamsDialog } from './SmartParamsDialog';
import { InstaQLResult } from '@instantdb/react';
import { AppSchema } from '../../../instant.schema';
import { useState } from 'react';
import { db } from '../../instantdb';

interface BaseProps {
  smartParams: InstaQLResult<AppSchema, { smartParams: {} }>['smartParams'];
}

interface BoardProps extends BaseProps {
  type: 'board';
  boardId: string;
}

interface TaskProps extends BaseProps {
  type: 'task';
  taskId: string;
  taskBoardId?: string;
}

type SmartParamsProps = BoardProps | TaskProps;

export function SmartParams({ type, smartParams, ...props }: SmartParamsProps) {
  console.log({ props });
  const [isDialogOpen, setDialogOpen] = useState(false);
  const { data: boardParams } = db.useQuery(
    // @ts-ignore
    type === 'task' && props.taskBoardId
      ? {
          smartParams: {
            $: {
              where: {
                // @ts-ignore
                boardId: props.taskBoardId,
              },
            },
          },
        }
      : null
  );

  console.log({ boardParams });

  return (
    <HStack>
      {boardParams?.smartParams.map((sp) => (
        <Tag.Root key={sp.id} variant="surface">
          {sp.type !== 'number' && (
            <Tag.StartElement>
              {sp.type === 'string' && <LuCaseLower />}
              {sp.type === 'date' && <LuCalendar />}
              {sp.type === 'time' && <LuTimer />}
            </Tag.StartElement>
          )}
          <Tag.Label>
            {sp.name}: <strong>{sp.value}</strong>
          </Tag.Label>
        </Tag.Root>
      ))}
      {smartParams.map((sp) => (
        <Tag.Root key={sp.id} variant="outline">
          {sp.type !== 'number' && (
            <Tag.StartElement>
              {sp.type === 'string' && <LuCaseLower />}
              {sp.type === 'date' && <LuCalendar />}
              {sp.type === 'time' && <LuTimer />}
            </Tag.StartElement>
          )}
          <Tag.Label>
            {sp.name}: <strong>{sp.value}</strong>
          </Tag.Label>
        </Tag.Root>
      ))}
      {smartParams.length === 0 && <Text>Click to add smart params</Text>}
      {type === 'board' && (
        <SmartParamsDialog
          isOpen={isDialogOpen}
          type="board"
          // @ts-ignore
          boardId={props.boardId}
          opener={
            <IconButton variant="ghost" size="xs" onClick={() => setDialogOpen(true)}>
              <LuPencilLine />
            </IconButton>
          }
          smartParams={smartParams}
          onClose={() => setDialogOpen(false)}
        />
      )}
      {type === 'task' && (
        <SmartParamsDialog
          isOpen={isDialogOpen}
          type="task"
          // @ts-ignore
          taskId={props.taskId}
          opener={
            <IconButton variant="ghost" size="xs" onClick={() => setDialogOpen(true)}>
              <LuPencilLine />
            </IconButton>
          }
          smartParams={smartParams}
          onClose={() => setDialogOpen(false)}
        />
      )}
    </HStack>
  );
}
