import { HStack, Tag, IconButton, Text } from '@chakra-ui/react';
import { LuCalendar, LuTimer, LuPencilLine, LuCaseLower, LuUser } from 'react-icons/lu';
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

function isTaskProps(props: SmartParamsProps): props is TaskProps {
  return (props as TaskProps).type === 'task';
}

export function SmartParams(props: SmartParamsProps) {
  const [isDialogOpen, setDialogOpen] = useState(false);
  const { data: boardParams } = db.useQuery(
    isTaskProps(props) && props?.taskBoardId
      ? {
          smartParams: {
            $: {
              where: {
                boardId: props.taskBoardId,
              },
            },
          },
        }
      : null
  );

  return (
    <HStack>
      {boardParams?.smartParams.map((sp) => (
        <Tag.Root key={sp.id} variant="surface">
          {sp.type !== 'number' && (
            <Tag.StartElement>
              {sp.type === 'string' && <LuCaseLower />}
              {sp.type === 'date' && <LuCalendar />}
              {sp.type === 'time' && <LuTimer />}
              {sp.type === 'user' && <LuUser />}
            </Tag.StartElement>
          )}
          <Tag.Label>
            {sp.name}: <strong>{sp.type === 'user' ? JSON.parse(sp.value).userEmail : sp.value}</strong>
          </Tag.Label>
        </Tag.Root>
      ))}
      {props.smartParams.map((sp) => (
        <Tag.Root key={sp.id} variant="outline">
          {sp.type !== 'number' && (
            <Tag.StartElement>
              {sp.type === 'string' && <LuCaseLower />}
              {sp.type === 'date' && <LuCalendar />}
              {sp.type === 'time' && <LuTimer />}
              {sp.type === 'user' && <LuUser />}
            </Tag.StartElement>
          )}
          <Tag.Label>
            {sp.name}: <strong>{sp.type === 'user' ? JSON.parse(sp.value).userEmail : sp.value}</strong>
          </Tag.Label>
        </Tag.Root>
      ))}
      {props.smartParams.length === 0 && <Text>Click to add smart params</Text>}
      {props.type === 'board' && (
        <SmartParamsDialog
          isOpen={isDialogOpen}
          type="board"
          boardId={props.boardId}
          opener={
            <IconButton variant="ghost" size="xs" onClick={() => setDialogOpen(true)}>
              <LuPencilLine />
            </IconButton>
          }
          smartParams={props.smartParams}
          onClose={() => setDialogOpen(false)}
        />
      )}
      {props.type === 'task' && (
        <SmartParamsDialog
          isOpen={isDialogOpen}
          type="task"
          taskId={props.taskId}
          opener={
            <IconButton variant="ghost" size="xs" onClick={() => setDialogOpen(true)}>
              <LuPencilLine />
            </IconButton>
          }
          smartParams={props.smartParams}
          onClose={() => setDialogOpen(false)}
        />
      )}
    </HStack>
  );
}
