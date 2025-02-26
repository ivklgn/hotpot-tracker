import { Fieldset, HStack, IconButton, Input, Text } from '@chakra-ui/react';
import { Button } from '@/components/ui/button';
import {
  DialogActionTrigger,
  DialogBody,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogRoot,
  DialogTitle,
  DialogTrigger,
  DialogCloseTrigger,
} from '@/components/ui/dialog';
import { Select } from 'chakra-react-select';
import { cloneElement, useEffect, useRef, useState } from 'react';
import React from 'react';
import { LuPlus, LuX } from 'react-icons/lu';
import { id, InstaQLEntity, InstaQLResult } from '@instantdb/react';
import { db } from '../../instantdb';
import { useAccount } from '../account/AccountContext';
import { AppSchema } from '../../../instant.schema';

const SMART_PARAMS_TYPES = [
  {
    value: 'string',
    label: 'String',
  },
  {
    value: 'number',
    label: 'Number',
  },
  {
    value: 'time',
    label: 'Time',
  },
  {
    value: 'date',
    label: 'Date',
  },
];

type SmartParam = InstaQLEntity<AppSchema, 'smartParams'>;

interface EditableSmartParam extends Pick<SmartParam, 'id' | 'name' | 'type' | 'value'> {
  isNew: boolean;
}

interface BaseProps {
  opener: React.ReactElement;
  smartParams: InstaQLResult<AppSchema, { smartParams: {} }>['smartParams'];
  boardId?: string;
  taskId?: string;
  isOpen: boolean;
  onClose?: () => void;
}

interface SmartParamsBoardProps extends BaseProps {
  type: 'board';
  boardId: string;
}

interface SmartParamsTaskProps extends BaseProps {
  type: 'task';
  taskId: string;
}

export const SmartParamsDialog: React.FC<SmartParamsBoardProps | SmartParamsTaskProps> = ({
  isOpen,
  opener,
  smartParams,
  type,
  onClose,
  ...props
}) => {
  const [editedParams, setEditedParams] = useState<EditableSmartParam[]>([]);
  const ref = useRef<HTMLInputElement>(null);
  const { currentTeamId } = useAccount();
  const contentRef = useRef<HTMLDivElement>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const idsForCreate = editedParams.filter((param) => param.isNew);
    if (idsForCreate.length > 0) {
      createSmartParams(
        type === 'board'
          ? {
              type: 'board',
              smartParams: idsForCreate,
              teamId: currentTeamId as string,
              boardId: props.boardId as string,
            }
          : {
              type: 'task',
              smartParams: idsForCreate,
              teamId: currentTeamId as string,
              taskId: props.taskId as string,
            }
      );
    }

    const idsForUpdate = editedParams.filter((param) => !param.isNew);
    if (idsForUpdate) {
      updateSmartParams({
        smartParams: idsForUpdate,
      });
    }

    onClose?.();
  };

  const handleAddParamClick = () => {
    setEditedParams((prev) => [...prev, { id: id(), name: '', type: 'string', value: '', isNew: true }]);
  };

  const handleDeleteParamClick = (id: string) => {
    deleteSmartParam({ smartParamId: id }).then(() => {
      setEditedParams((prev) => prev.filter((param) => param.id !== id));
    });
  };

  const handleChangeParam = (id: string, fieldName: keyof EditableSmartParam, fieldValue?: string) => {
    setEditedParams((prev) =>
      prev.map((param) => {
        if (param.id === id) {
          return { ...param, [fieldName]: fieldValue };
        }
        return param;
      })
    );
  };

  useEffect(() => {
    if (smartParams) {
      setEditedParams(() =>
        smartParams.map((param) => ({
          id: param.id,
          name: param.name,
          type: param.type,
          value: param.value,
          isNew: false,
        }))
      );
    }
  }, [smartParams]);

  return (
    <DialogRoot initialFocusEl={() => ref.current} open={isOpen} size="lg">
      <DialogTrigger asChild>
        {cloneElement(opener, {
          ref,
        })}
      </DialogTrigger>
      <DialogContent ref={contentRef}>
        <DialogCloseTrigger onClick={() => onClose?.()} />
        <form onSubmit={handleSubmit}>
          <DialogHeader>
            <DialogTitle>Add or edit smart params</DialogTitle>
          </DialogHeader>
          <DialogBody pb="4">
            <Fieldset.Root size="sm">
              <Fieldset.Content>
                {editedParams.length === 0 && <Text>No params, click to add params</Text>}
                {editedParams.length > 0 &&
                  editedParams.map((param) => (
                    <ParamField
                      key={param.id}
                      param={param}
                      onDelete={handleDeleteParamClick}
                      onChange={handleChangeParam}
                    />
                  ))}
              </Fieldset.Content>
            </Fieldset.Root>
          </DialogBody>
          <DialogFooter justifyContent="space-between">
            <IconButton aria-label="Create task" variant="plain" size="xs" onClick={handleAddParamClick}>
              <LuPlus /> Add param
            </IconButton>
            <HStack>
              <DialogActionTrigger asChild>
                <Button
                  variant="outline"
                  onClick={() => {
                    onClose?.();
                  }}
                  size="xs"
                >
                  Cancel
                </Button>
              </DialogActionTrigger>
              <Button type="submit" size="xs">
                Save
              </Button>
            </HStack>
          </DialogFooter>
        </form>
      </DialogContent>
    </DialogRoot>
  );
};

function ParamField({
  param,
  onDelete,
  onChange,
}: {
  param: EditableSmartParam;
  onDelete?: (id: string) => void;
  onChange?: (id: string, fieldName: keyof EditableSmartParam, fieldValue?: string) => void;
}) {
  return (
    <div key={param.id}>
      <HStack>
        <Input
          name="name"
          placeholder="Name"
          size="sm"
          onChange={(e) => onChange?.(param.id, 'name', e.target.value)}
          value={param.name}
          maxW="160px"
        />
        <Select
          options={SMART_PARAMS_TYPES}
          placeholder="Type"
          size="sm"
          onChange={(newValue) => onChange?.(param.id, 'type', newValue?.value)}
          value={{
            value: param.type,
            label: SMART_PARAMS_TYPES.find((type) => type.value === param.type)?.label,
          }}
          styles={{
            control: (base) => ({
              ...base,
              minWidth: '100px',
            }),
          }}
        />
        {param.type === 'string' && (
          <Input
            name="value"
            placeholder="value"
            size="sm"
            onChange={(e) => onChange?.(param.id, 'value', e.target.value)}
            value={param.value}
            type="text"
          />
        )}
        {param.type === 'number' && (
          <Input
            name="value"
            placeholder="10"
            size="sm"
            onChange={(e) => onChange?.(param.id, 'value', e.target.value)}
            value={param.value}
            type="number"
          />
        )}
        {param.type === 'time' && (
          <Input
            placeholder="1w 2d"
            size="sm"
            onChange={(e) => onChange?.(param.id, 'value', e.target.value)}
            value={param.value}
            type="text"
          />
        )}
        {param.type === 'date' && (
          <Input
            name="value"
            placeholder="19.02.2028"
            size="sm"
            onChange={(e) => onChange?.(param.id, 'value', e.target.value)}
            value={param.value}
            type="date"
          />
        )}
        <IconButton
          aria-label="Delete param"
          variant="plain"
          size="xs"
          onClick={() => {
            onDelete?.(param.id);
          }}
        >
          <LuX />
        </IconButton>
      </HStack>
    </div>
  );
}

async function deleteSmartParam({ smartParamId }: { smartParamId: string }) {
  return await db.transact([db.tx.smartParams[smartParamId].delete()]);
}

interface CreateSmartParams {
  smartParams: EditableSmartParam[];
  teamId: string;
}

interface CreateBoardSmartParams extends CreateSmartParams {
  type: 'board';
  boardId: string;
}

interface CreateTaskSmartParams extends CreateSmartParams {
  type: 'task';
  taskId: string;
}

function isBoardSmartParams(
  smartParams: CreateBoardSmartParams | CreateTaskSmartParams
): smartParams is CreateBoardSmartParams {
  return (smartParams as CreateBoardSmartParams).type === 'board';
}

function isTaskSmartParams(
  smartParams: CreateBoardSmartParams | CreateTaskSmartParams
): smartParams is CreateTaskSmartParams {
  return (smartParams as CreateTaskSmartParams).type === 'task';
}

async function createSmartParams(params: CreateBoardSmartParams | CreateTaskSmartParams) {
  const ids: string[] = [];
  for (const sp of params.smartParams) {
    const newSmartParam = id();
    await db
      .transact([
        db.tx.smartParams[newSmartParam]
          .update({
            name: sp.name,
            type: sp.type,
            value: sp.value,
            boardId: isBoardSmartParams(params) ? params.boardId : undefined,
            taskId: isTaskSmartParams(params) ? params.taskId : undefined,
            teamId: params.teamId,
          })
          .link({ teams: params.teamId }),
        params.type === 'board'
          ? db.tx.smartParams[newSmartParam].link({ boards: params.boardId })
          : db.tx.smartParams[newSmartParam].link({ tasks: params.taskId }),
      ])
      .then(() => {
        ids.push(newSmartParam);
      });
  }

  return ids;
}

async function updateSmartParams({ smartParams }: { smartParams: EditableSmartParam[] }) {
  const ids: string[] = [];
  for (const sp of smartParams) {
    const newSmartParam = id();
    await db
      .transact([db.tx.smartParams[sp.id].merge({ name: sp.name, type: sp.type, value: sp.value })])
      .then(() => {
        ids.push(newSmartParam);
      });
  }

  return ids;
}
