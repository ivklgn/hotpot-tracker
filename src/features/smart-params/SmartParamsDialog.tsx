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
import { cloneElement, useEffect, useMemo, useRef, useState } from 'react';
import React from 'react';
import { LuPlus, LuX } from 'react-icons/lu';
import { id, InstaQLEntity, InstaQLResult } from '@instantdb/react';
import { db } from '../../instantdb';
import { useAccount } from '../account/AccountContext';
import { AppSchema } from '../../../instant.schema';
import { isJSON } from '../../utils/json';
import { runTransaction } from '../../core/instantdb-transaction';
import tariffLimits from '../../../tariff-limits.json';
import { toaster } from '@/utils/toaster';
import { isInstantDBPermissionError } from '../../core/instantdb-errors';

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
  {
    value: 'user',
    label: 'User',
  },
];

type SmartParam = InstaQLEntity<AppSchema, 'smartParams'>;

interface EditableSmartParam extends Pick<SmartParam, 'id' | 'name' | 'type' | 'value' | 'creatorId'> {
  isNew: boolean;
}

interface BaseProps {
  opener: React.ReactElement<{ ref?: React.Ref<HTMLInputElement> }>;
  smartParams: InstaQLResult<AppSchema, { smartParams: {} }>['smartParams'];
  boardId?: string;
  taskId?: string;
  creatorId?: string;
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
  const prevIsOpenRef = useRef(isOpen);
  const { user } = db.useAuth();
  const { data: memberships } = db.useQuery({
    memberships: {
      $: {
        where: {
          teamId: currentTeamId as string,
          userId: {
            $isNull: false,
          },
        },
      },
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const idsForCreate = editedParams.filter((param) => param.isNew && !!param.name && !!param.value);
    if (idsForCreate.length > 0) {
      runTransaction(
        () =>
          createSmartParams(
            type === 'board'
              ? {
                  type: 'board',
                  smartParams: idsForCreate,
                  teamId: currentTeamId as string,
                  boardId: props.boardId as string,
                  creatorId: user?.id as string,
                }
              : {
                  type: 'task',
                  smartParams: idsForCreate,
                  teamId: currentTeamId as string,
                  taskId: props.taskId as string,
                  creatorId: user?.id,
                }
          ),
        () => {},
        (error) => {
          if (isInstantDBPermissionError(error)) {
            toaster.create({
              title: `Maximum ${tariffLimits.free.max_smart_params} smart params allowed for ${type}`,
              type: 'error',
            });
          }
        }
      );
    }

    const idsForUpdate = editedParams.filter((param) => !param.isNew && !!param.name && !!param.value);
    if (idsForUpdate) {
      runTransaction(() =>
        updateSmartParams({
          smartParams: idsForUpdate,
        })
      );
    }

    onClose?.();
  };

  const handleAddParamClick = () => {
    setEditedParams((prev) => [
      ...prev,
      { id: id(), name: '', type: 'string', value: '', isNew: true, creatorId: user?.id as string },
    ]);
  };

  const handleDeleteParamClick = (id: string, isNew: boolean) => {
    if (isNew) {
      setEditedParams((prev) => prev.filter((param) => param.id !== id));
      return;
    }

    runTransaction(
      () => deleteSmartParam({ smartParamId: id }),
      () => {
        setEditedParams((prev) => prev.filter((param) => param.id !== id));
      }
    );
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

  // Only sync smartParams when dialog opens, not on every change
  // Using queueMicrotask makes setState async, preventing cascading renders
  useEffect(() => {
    const wasClosedNowOpen = !prevIsOpenRef.current && isOpen;
    prevIsOpenRef.current = isOpen;

    if (wasClosedNowOpen && smartParams) {
      queueMicrotask(() => {
        setEditedParams(() =>
          smartParams.map((param) => ({
            id: param.id,
            name: param.name,
            type: param.type,
            value: param.value,
            isNew: false,
            creatorId: user?.id as string,
          }))
        );
      });
    }
  }, [isOpen, smartParams, user?.id]);

  useEffect(() => {
    if (!isOpen) {
      queueMicrotask(() => {
        setEditedParams((prev) => prev.filter((param) => !param.isNew));
      });
    }
  }, [isOpen]);

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
                    <SmartParamField
                      key={param.id}
                      param={param}
                      memberships={memberships?.memberships}
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

function SmartParamField({
  param,
  memberships,
  onDelete,
  onChange,
}: {
  param: EditableSmartParam;
  memberships?: InstaQLResult<AppSchema, { memberships: {} }>['memberships'];
  onDelete?: (id: string, isNew: boolean) => void;
  onChange?: (id: string, fieldName: keyof EditableSmartParam, fieldValue?: string) => void;
}) {
  const paramValue = useMemo(() => {
    return isJSON(param.value) ? JSON.parse(param.value) : param.value;
  }, [param.value]);

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
          maxLength={20}
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
            value={paramValue}
            type="text"
            maxLength={20}
          />
        )}
        {param.type === 'number' && (
          <Input
            name="value"
            placeholder="10"
            size="sm"
            onChange={(e) => onChange?.(param.id, 'value', e.target.value)}
            value={paramValue}
            type="number"
          />
        )}
        {param.type === 'time' && (
          <Input
            placeholder="1w 2d"
            size="sm"
            onChange={(e) => onChange?.(param.id, 'value', e.target.value)}
            value={paramValue}
            type="text"
            maxLength={20}
          />
        )}
        {param.type === 'date' && (
          <Input
            name="value"
            placeholder="19.02.2028"
            size="sm"
            onChange={(e) => onChange?.(param.id, 'value', e.target.value)}
            value={paramValue}
            type="date"
          />
        )}
        {param.type === 'user' && (
          <Select
            size="sm"
            onChange={(selectedOption) =>
              onChange?.(
                param.id,
                'value',
                JSON.stringify({ userId: selectedOption?.value, userEmail: selectedOption?.label })
              )
            }
            options={memberships?.map((member) => ({
              value: member.userId,
              label: member.userEmail,
            }))}
            noOptionsMessage={() => 'No members for select'}
            placeholder="Select user"
            value={{ value: paramValue?.userId, label: paramValue?.userEmail }}
          />
        )}
        <IconButton
          aria-label="Delete param"
          variant="plain"
          size="xs"
          onClick={() => {
            onDelete?.(param.id, param.isNew);
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
  creatorId?: string;
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
  const transactions = params.smartParams.flatMap((sp) => {
    const newSmartParam = id();
    ids.push(newSmartParam);

    return [
      db.tx.smartParams[newSmartParam]
        .update({
          updatedAt: new Date().toJSON(),
          name: sp.name,
          type: sp.type,
          value: sp.value,
          boardId: isBoardSmartParams(params) ? params.boardId : undefined,
          taskId: isTaskSmartParams(params) ? params.taskId : undefined,
          teamId: params.teamId,
          createdAt: new Date().toJSON(),
          creatorId: params.creatorId,
        })
        .link({ teams: params.teamId }),
      params.type === 'board'
        ? db.tx.smartParams[newSmartParam].link({ boards: params.boardId })
        : db.tx.smartParams[newSmartParam].link({ tasks: params.taskId }),
    ];
  });

  await db.transact(transactions);
  return ids;
}

async function updateSmartParams({ smartParams }: { smartParams: EditableSmartParam[] }) {
  const ids = smartParams.map((sp) => sp.id);
  const transactions = smartParams.map((sp) =>
    db.tx.smartParams[sp.id].merge({
      updatedAt: new Date().toJSON(),
      name: sp.name,
      type: sp.type,
      value: sp.value,
    })
  );

  await db.transact(transactions);
  return ids;
}
