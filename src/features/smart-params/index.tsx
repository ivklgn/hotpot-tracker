import { HStack, Tag, IconButton, Text } from '@chakra-ui/react';
import { LuCalendar, LuTimer, LuPencilLine, LuCaseLower } from 'react-icons/lu';
import { SmartParamsDialog } from './SmartParamsDialog';
import { InstaQLResult } from '@instantdb/react';
import { AppSchema } from '../../../instant.schema';

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
}

type SmartParamsProps = BoardProps | TaskProps;

export function SmartParams({ type, smartParams, ...props }: SmartParamsProps) {
  return (
    <HStack>
      {smartParams.map((sp) => (
        <Tag.Root key={sp.id}>
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
          type="board"
          // @ts-ignore
          boardId={props.boardId}
          opener={
            <IconButton variant="ghost" size="xs">
              <LuPencilLine />
            </IconButton>
          }
          smartParams={smartParams}
        />
      )}
      {type === 'task' && (
        <SmartParamsDialog
          type={type}
          // @ts-ignore
          taskId={props.taskId}
          opener={
            <IconButton variant="ghost" size="xs">
              <LuPencilLine />
            </IconButton>
          }
          smartParams={smartParams}
        />
      )}
    </HStack>
  );
}
