import { HStack, Tag, IconButton, Text } from '@chakra-ui/react';
import { LuCalendar, LuTimer, LuPencilLine, LuCaseLower, LuUser } from 'react-icons/lu';
import { SmartParamsDialog } from './SmartParamsDialog';
import { InstaQLResult } from '@instantdb/react';
import { AppSchema } from '../../../instant.schema';
import { useState } from 'react';
import { db } from '../../instantdb';
import { isJSON } from '../../utils/json';

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

// only for task on board
interface BoardTaskProps extends BaseProps {
  type: 'board-task';
  taskId: string;
}

type SmartParamsProps = BoardProps | TaskProps | BoardTaskProps;

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
    <HStack wrap="wrap">
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
            {sp.name}:{' '}
            <strong>
              {sp.type === 'user' && isJSON(sp.value) ? JSON.parse(sp.value)?.userEmail : sp.value}
            </strong>
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
            {sp.name}:{' '}
            <strong>
              {sp.type === 'user' && isJSON(sp.value) ? JSON.parse(sp.value)?.userEmail : sp.value}
            </strong>
          </Tag.Label>
        </Tag.Root>
      ))}
      {props.type !== 'board-task' && props.smartParams.length === 0 && (
        <Text>Click to add smart params</Text>
      )}
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
