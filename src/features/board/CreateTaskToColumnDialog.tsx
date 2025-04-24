import { DialogCloseTrigger, Input, Tabs } from '@chakra-ui/react';
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
} from '@/components/ui/dialog';
import { Field } from '@/components/ui/field';
import { cloneElement, useRef, useState } from 'react';
import React from 'react';
import { db } from '../../instantdb';
import { id } from '@instantdb/react';
import { runTransaction } from '../../core/instantdb-transaction';
import { LuPlus, LuSearch } from 'react-icons/lu';
import { useAccount } from '../account/AccountContext';
import { Select } from 'chakra-react-select';
import { useDebounce } from '../../hooks/useDebounce';
import tariffLimits from '../../../tariff-limits.json';
import { toaster } from '@/utils/toaster';
import { useLocation } from 'wouter';

interface CreateTaskToColumnDialogProps {
  columnId: string;
  boardId: string;
  opener?: React.ReactElement;
  isOpen?: boolean;
  onClose?: () => void;
}

export const CreateTaskToColumnDialog: React.FC<CreateTaskToColumnDialogProps> = ({
  columnId,
  boardId,
  opener,
  isOpen,
  onClose,
}) => {
  const ref = useRef<HTMLInputElement>(null);
  const { user } = db.useAuth();
  const [title, setTitle] = useState('');
  const [existingTaskId, setExistingTaskId] = useState<string>();
  const [tab, setTab] = useState<'new' | 'existing'>('new');
  const [taskApproveIds, setTaskApproveIds] = useState<string[]>([]);
  const { currentTeamId } = useAccount();
  const [, navigate] = useLocation();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (tab === 'new' && title) {
      runTransaction(
        () =>
          createNewTask({
            title,
            columnId,
            teamId: currentTeamId as string,
            boardId,
            creatorId: user?.id,
          }),
        (newTaskId) => {
          toaster.create({
            title: 'Task created',
            type: 'success',
            action: {
              label: 'Go to task',
              onClick: () => {
                navigate(`/task/${newTaskId}`);
              },
            },
          });
          setTitle('');
          onClose?.();
        },
        (error) => {
          // eslint-disable-next-line @typescript-eslint/ban-ts-comment
          // @ts-expect-error
          if (error.originalError?.hint?.expected === 'perms-pass?') {
            onClose?.();
            toaster.create({
              title: `Maximum ${tariffLimits.free.max_columns_per_board} tasks allowed`,
              type: 'error',
            });
          }
        }
      );
    } else if (tab === 'existing' && existingTaskId) {
      runTransaction(
        () =>
          updateTaskColumn({
            taskId: existingTaskId,
            columnId,
            approvesIds: taskApproveIds,
          }),
        () => {
          setExistingTaskId(undefined);
          onClose?.();
        }
      );
    }
  };

  return (
    <DialogRoot initialFocusEl={() => ref.current} open={isOpen}>
      {opener && (
        <DialogTrigger asChild>
          {cloneElement(opener, {
            ref,
          })}
        </DialogTrigger>
      )}
      <DialogContent>
        <DialogCloseTrigger onClick={() => onClose?.()} />
        <form onSubmit={handleSubmit}>
          <DialogHeader>
            <DialogTitle>Create or add task to column</DialogTitle>
          </DialogHeader>
          <DialogBody pb="4">
            <Tabs.Root
              variant="enclosed"
              size="sm"
              fitted
              value={tab}
              mb="4"
              onValueChange={(details) => {
                setTab(details.value as 'new' | 'existing');
              }}
            >
              <Tabs.List>
                <Tabs.Trigger value="new">
                  <LuPlus />
                  New
                </Tabs.Trigger>
                <Tabs.Trigger value="existing">
                  <LuSearch /> Find existing
                </Tabs.Trigger>
              </Tabs.List>
            </Tabs.Root>
            {tab === 'new' && (
              <Field label="Title">
                <Input
                  ref={ref}
                  placeholder="Task title"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  required
                  type="text"
                  minLength={1}
                  maxLength={80}
                />
              </Field>
            )}
            {tab === 'existing' && (
              <SearchTaskSelect
                columnId={columnId}
                onSelect={(taskId, taskApproveIds) => {
                  setExistingTaskId(taskId);
                  if (taskApproveIds) {
                    setTaskApproveIds(taskApproveIds);
                  }
                }}
              />
            )}
          </DialogBody>
          <DialogFooter>
            <DialogActionTrigger asChild>
              <Button
                variant="outline"
                onClick={() => {
                  onClose?.();
                }}
              >
                Cancel
              </Button>
            </DialogActionTrigger>
            <Button type="submit">{tab === 'new' ? 'Create' : 'Add'}</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </DialogRoot>
  );
};

interface SearchTaskSelectProps {
  columnId: string;
  onSelect?: (taskId: string, taskApproveIds?: string[]) => void;
}

function SearchTaskSelect({ columnId, onSelect }: SearchTaskSelectProps) {
  const { currentTeamId } = useAccount();
  const [search, setSearch] = useState('');
  const debouncedSearch = useDebounce(search, 1000);
  const { data: tasks } = db.useQuery(
    debouncedSearch && debouncedSearch.length >= 2
      ? {
          tasks: {
            columns: {
              contributors: {},
            },
            approves: {},
            $: {
              where: {
                teamId: currentTeamId as string,
                title: { $like: `%${debouncedSearch}%` },
                'columns.id': { $not: columnId },
              },
              // TODO: add limit?
              // limit: 10,
            },
          },
        }
      : null
  );

  const options = tasks?.tasks
    ?.filter((task) => {
      return (
        !task.columns?.approveRule ||
        (task.columns?.approveRule === 'one-of-contributors' && task.approves?.length > 0) ||
        (task.columns?.approveRule === 'all-contributors' &&
          task.approves?.length === task.columns?.contributors?.length)
      );
    })
    ?.map((task) => ({
      value: task.id,
      label: task.title,
      meta: 1,
    }));

  return (
    <Select
      placeholder="Find task"
      onChange={(selectedValue) => {
        onSelect?.(
          selectedValue?.value as string,
          tasks?.tasks
            ?.find((task) => task.id === selectedValue?.value)
            ?.approves?.map((approve) => approve.id)
        );
      }}
      onInputChange={(value) => {
        setSearch(value);
      }}
      options={options}
      isLoading={search !== debouncedSearch}
    />
  );
}

async function updateTaskColumn({
  taskId,
  columnId,
  approvesIds,
}: {
  taskId: string;
  columnId: string;
  approvesIds: string[];
}) {
  return await db.transact([
    db.tx.tasks[taskId].update({ updatedAt: new Date().toJSON(), columnId, createdAt: new Date().toJSON() }),
    db.tx.tasks[taskId].link({ columns: columnId }),
    ...(approvesIds || []).map((ai) => db.tx.approves[ai].delete()),
  ]);
}

async function createNewTask({
  title,
  columnId,
  teamId,
  creatorId,
  boardId,
}: {
  title: string;
  columnId: string;
  teamId: string;
  creatorId?: string;
  boardId: string;
}) {
  const newTaskId = id();

  await db.transact([
    db.tx.tasks[newTaskId].update({
      updatedAt: new Date().toJSON(),
      title,
      teamId,
      columnId,
      boardId,
      createdAt: new Date().toJSON(),
      creatorId,
    }),
    db.tx.tasks[newTaskId].link({ columns: columnId }),
    db.tx.tasks[newTaskId].link({ teams: teamId }),
    db.tx.tasks[newTaskId].link({ boards: boardId }),
  ]);

  return newTaskId;
}
