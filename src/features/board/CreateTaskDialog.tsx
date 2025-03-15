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

interface CreateTaskDialogToColumnProps {
  columnId: string;
  opener?: React.ReactElement;
  isOpen?: boolean;
  onClose?: () => void;
}

export const CreateTaskDialogToColumn: React.FC<CreateTaskDialogToColumnProps> = ({
  columnId,
  opener,
  isOpen,
  onClose,
}) => {
  const ref = useRef<HTMLInputElement>(null);
  const { user } = db.useAuth();
  const [title, setTitle] = useState('');
  const [existingTaskId, setExistingTaskId] = useState<string>();
  const [tab, setTab] = useState<'new' | 'existing'>('new');
  const { currentTeamId } = useAccount();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (tab === 'new' && title) {
      runTransaction(() =>
        createNewTask({
          title,
          columnId,
          teamId: currentTeamId as string,
          creatorId: user?.id,
        })
      ).then(() => {
        setTitle('');
        onClose?.();
      });
    } else if (tab === 'existing' && existingTaskId) {
      runTransaction(() =>
        updateTaskColumn({
          taskId: existingTaskId,
          columnId,
        })
      ).then(() => {
        setExistingTaskId(undefined);
        onClose?.();
      });
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
                />
              </Field>
            )}
            {tab === 'existing' && (
              <SearchTaskSelect
                onSelect={(taskId) => {
                  setExistingTaskId(taskId);
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

async function createNewTask({
  title,
  columnId,
  teamId,
  creatorId,
}: {
  title: string;
  columnId: string;
  teamId: string;
  creatorId?: string;
}) {
  const newTaskId = id();

  return await db.transact([
    db.tx.tasks[newTaskId].update({
      title,
      teamId,
      columnId,
      createdAt: new Date().toJSON(),
      creatorId,
    }),
    db.tx.tasks[newTaskId].link({ columns: columnId }),
    db.tx.tasks[newTaskId].link({ teams: teamId }),
  ]);
}

interface SearchTaskSelectProps {
  onSelect?: (taskId: string) => void;
}

function SearchTaskSelect({ onSelect }: SearchTaskSelectProps) {
  const { currentTeamId } = useAccount();
  const [search, setSearch] = useState('');
  const debouncedSearch = useDebounce(search, 1000);
  const { data: tasks } = db.useQuery(
    debouncedSearch && debouncedSearch.length >= 2
      ? {
          tasks: {
            $: {
              where: {
                teamId: currentTeamId as string,
                title: { $like: `%${debouncedSearch}%` },
              },
              // TODO: add limit?
              // limit: 10,
            },
          },
        }
      : null
  );

  return (
    <Select
      placeholder="Find task"
      onChange={(selectedValue) => {
        onSelect?.(selectedValue?.value as string);
      }}
      onInputChange={(value) => {
        setSearch(value);
      }}
      options={tasks?.tasks?.map((task) => ({
        value: task.id,
        label: task.title,
      }))}
      isLoading={search !== debouncedSearch}
    />
  );
}

async function updateTaskColumn({ taskId, columnId }: { taskId: string; columnId: string }) {
  return await db.transact([
    db.tx.tasks[taskId].update({
      columnId,
      createdAt: new Date().toJSON(),
    }),
    db.tx.tasks[taskId].link({ columns: columnId }),
  ]);
}
