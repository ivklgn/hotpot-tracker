import { HStack, Tag, IconButton } from '@chakra-ui/react';
import { LuCalendar, LuTimer, LuCalendar1, LuPencilLine } from 'react-icons/lu';
import { SmartParamsDialog } from './SmartParamsDialog';

interface SmartParamsProps {
  mode?: 'view' | 'edit';
}

export function SmartParams({ mode = 'view' }: SmartParamsProps) {
  return (
    <HStack>
      <Tag.Root>
        <Tag.StartElement>
          <LuCalendar />
        </Tag.StartElement>
        <Tag.Label>
          Target end: <strong>25/12/1993</strong>
        </Tag.Label>
      </Tag.Root>
      <Tag.Root>
        <Tag.StartElement>
          <LuTimer />
        </Tag.StartElement>
        <Tag.Label>
          Time: <strong>1h 30m</strong>
        </Tag.Label>
      </Tag.Root>
      <Tag.Root>
        <Tag.StartElement>
          <LuCalendar1 />
        </Tag.StartElement>
        <Tag.Label>
          Range: <strong>25/12/1993 - 25/12/2025</strong>
        </Tag.Label>
      </Tag.Root>
      <SmartParamsDialog
        opener={
          <IconButton variant="ghost" size="xs">
            <LuPencilLine />
          </IconButton>
        }
      />
    </HStack>
  );
}
