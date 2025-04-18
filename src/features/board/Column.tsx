import {
  Box,
  Flex,
  Fieldset,
  IconButton,
  Button,
  ButtonGroup,
  Link as ChakraLink,
  Group,
  Text,
} from '@chakra-ui/react';
import { Field } from '@/components/ui/field';
import { CreatableSelect, Select } from 'chakra-react-select';
import { useMemo, useRef, useState } from 'react';
import { LuX, LuPencil, LuPlus, LuShieldCheck, LuShieldQuestion } from 'react-icons/lu';
import { db } from '../../instantdb';
import { id, InstaQLEntity, InstaQLResult } from '@instantdb/react';
import { useAccount } from '../account/AccountContext';
import { ConfirmAction } from '../../components/ConfirmAction';
import { UserAvatars } from '../../components/Avatars';
import { Link } from 'wouter';
import { useDrag, useDrop } from 'react-dnd';
import { AppSchema } from '../../../instant.schema';
import { SmartParams } from '../smart-params';
import { ToggleTip } from '../../components/ui/toggle-tip';
import { runTransaction } from '../../core/instantdb-transaction';
import { CreateTaskToColumnDialog } from './CreateTaskToColumnDialog';

export type ColumnType = InstaQLResult<
  AppSchema,
  {
    columns: {
      tasks: { smartParams: {}; approves: {}; issues?: {} };
      statuses: {};
      contributors: {
        memberships: {};
      };
    };
  }
>['columns'][0];

interface ColumnHeaderProps {
  column?: ColumnType;
  isEdit: boolean;
  onCreateTask: () => void;
  onEditClick: () => void;
  onCloseEdit: () => void;
}

function ColumnHeader({ column, isEdit, onCreateTask, onEditClick, onCloseEdit }: ColumnHeaderProps) {
  const hintText = useMemo(() => {
    if (column?.approveRule === 'all-contributors') {
      return 'Need approve from all contributors';
    }
    if (column?.approveRule === 'one-of-contributors') {
      return 'Need approve from one of contributors';
    }
    return 'No approve rules for this column';
  }, [column?.approveRule]);

  return (
    <Flex direction="row" alignItems="baseline" ml={2}>
      <ToggleTip content={hintText} showArrow>
        <Flex direction="row" alignItems="baseline" cursor="pointer">
          <Group>
            <UserAvatars
              users={
                column?.contributors && column.contributors.every((contributor) => !!contributor.memberships)
                  ? column.contributors.map((contributor) => ({
                      userId: contributor.memberships?.userId as string,
                      userEmail: contributor.memberships?.userEmail as string,
                    }))
                  : []
              }
              size="2xs"
            />
            <Text fontWeight="bold">{column?.statuses ? column.statuses.name : undefined}</Text>
            {column?.approveRule && column?.contributors?.length > 0 && <LuShieldCheck color="yellow.400" />}
          </Group>
        </Flex>
      </ToggleTip>

      <ButtonGroup size="xs" variant="outline" ml="auto">
        {!isEdit && (
          <IconButton aria-label="Create task" variant="plain" onClick={onCreateTask}>
            <LuPlus />
          </IconButton>
        )}
        {isEdit && (
          <IconButton aria-label="Close edit" variant="plain" onClick={onCloseEdit} ml="auto">
            <LuX />
          </IconButton>
        )}
        {!isEdit && (
          <IconButton aria-label="Edit column" variant="plain" onClick={onEditClick}>
            <LuPencil />
          </IconButton>
        )}
      </ButtonGroup>
    </Flex>
  );
}

interface ColumnTasksProps {
  column?: ColumnType;
  onDragTask?: (
    task: InstaQLEntity<AppSchema, 'tasks'>,
    targetColumn: ColumnType,
    currentColumnId?: string
  ) => void;
}

function ColumnTasks({ column, onDragTask }: ColumnTasksProps) {
  const [, taskDrop] = useDrop({
    accept: 'task',
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    drop: ({ task, columnId }: any) => {
      if (column?.id === columnId) return;
      return onDragTask?.(task, column as ColumnType, columnId);
    },
  });

  if (!column?.tasks) {
    return null;
  }

  return (
    <Flex direction="column" p="2" gap="2" height="440px" overflowY="scroll" ref={taskDrop}>
      {column?.tasks.map((task) => (
        <ColumnTask
          key={task.id}
          task={task}
          columnApproveRule={column?.approveRule}
          columnContributors={column?.contributors}
        />
      ))}
    </Flex>
  );
}

interface ColumnTaskProps {
  task: ColumnType['tasks'][0];
  columnApproveRule?: string;
  columnContributors?: ColumnType['contributors'];
}

function ColumnTask({ task, columnApproveRule, columnContributors }: ColumnTaskProps) {
  const [, /*{ isDragging }*/ drag] = useDrag({
    type: 'task',
    item: { task, columnId: task.columnId },
    collect: (monitor) => ({
      isDragging: !!monitor.isDragging(),
    }),
  });

  // simplified version
  const approved = useMemo(() => {
    if (!columnApproveRule || !task?.approves || columnContributors?.length === 0) return undefined;

    const approvedContributors = new Set(task.approves.map((a) => a.contributorId));

    if (columnApproveRule === 'all-contributors') {
      return columnContributors?.every((c) => approvedContributors.has(c.id));
    }

    if (columnApproveRule === 'one-of-contributors') {
      return approvedContributors.size > 0;
    }

    return undefined;
  }, [columnApproveRule, columnContributors, task?.approves]);

  return (
    <Box
      bg="bg"
      shadow="md"
      borderRadius="md"
      mb="2"
      p="2"
      key={task.id}
      ref={approved === undefined || approved ? drag : undefined}
    >
      <Box>
        <ChakraLink
          asChild
          colorPalette={approved !== undefined ? (approved ? 'teal' : 'yellow') : 'teal'}
          fontWeight="medium"
          fontSize="md"
        >
          <Link to={`/task/${task.id}`}>
            {task.title} {approved !== undefined ? approved ? <LuShieldCheck /> : <LuShieldQuestion /> : null}
          </Link>
        </ChakraLink>
      </Box>
      <Box mt={2}>
        {task?.smartParams && (
          <Box>
            <SmartParams mode="view" type="board-task" smartParams={task.smartParams} taskId={task.id} />
          </Box>
        )}
      </Box>
      {task?.issues?.length ? (
        <Box mt={2}>
          <Text textStyle="xs">{task.issues.length} issue(-s)</Text>
        </Box>
      ) : null}
    </Box>
  );
}

interface ColumnEditProps {
  column?: ColumnType;
  onSubmit: (e: React.FormEvent) => void;
  onClose: () => void;
}

function ColumnEdit({ column, onSubmit, onClose }: ColumnEditProps) {
  const { currentTeamId } = useAccount();
  const { user } = db.useAuth();
  const { data: statuses } = db.useQuery({
    statuses: {
      $: {
        where: {
          deletedAt: {
            $isNull: true,
          },
        },
      },
    },
  });
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

  return (
    <form onSubmit={onSubmit}>
      <Fieldset.Root p={4}>
        <Field label="Status">
          <CreatableSelect
            options={statuses?.statuses.map((status) => ({
              value: status.id,
              label: status.name,
            }))}
            placeholder="Select or create status"
            onChange={(value) => {
              runTransaction(() =>
                updateColumnStatus({
                  statusId: value?.value as string,
                  teamId: currentTeamId as string,
                  columnId: column?.id as string,
                })
              );
            }}
            value={
              column?.statuses
                ? {
                    value: column.statuses.id,
                    label: column.statuses.name,
                  }
                : undefined
            }
            onCreateOption={(value) => {
              runTransaction(() =>
                createStatusAndUpdateColumn({
                  name: value,
                  teamId: currentTeamId as string,
                  columnId: column?.id as string,
                  creatorId: user?.id,
                })
              );
            }}
          />
        </Field>
        <Field label="Contributors">
          <Select
            isMulti
            onChange={(changedContributors) => {
              if (changedContributors.length === 0) {
                runTransaction(() =>
                  deleteContributors({
                    contributorsIds: column?.contributors?.map((c) => c.id) as string[],
                  })
                );
                return;
              }

              if (changedContributors.length < (column?.contributors || []).length) {
                runTransaction(() =>
                  deleteContributors({
                    contributorsIds: column?.contributors
                      ?.filter((c) => !changedContributors.find((v) => v.value === c.memberships?.userId))
                      ?.map((c) => c.id) as string[],
                  })
                );
                return;
              }

              runTransaction(() =>
                updateContributors({
                  userMemberships: changedContributors.map((v) => ({
                    userId: v.value as string,
                    membershipId: memberships?.memberships.find((m) => m.userId === v.value)?.id as string,
                  })),
                  columnId: column?.id as string,
                  teamId: currentTeamId as string,
                  creatorId: user?.id as string,
                })
              );
            }}
            options={memberships?.memberships.map((member) => ({
              value: member.userId,
              label: member.userEmail,
            }))}
            placeholder="Select one or more contributors"
            value={
              column?.contributors
                ? column?.contributors.map((contributor) => ({
                    value: contributor.memberships?.userId,
                    label: contributor.memberships?.userEmail,
                  }))
                : undefined
            }
          />
        </Field>
        <Field label="Approve rules">
          <Select
            onChange={(value) => {
              runTransaction(() =>
                updateColumnApproveRule({
                  approveRule: value?.value as 'one-of-contributors' | 'all-contributors',
                  columnId: column?.id as string,
                })
              );
            }}
            options={[
              { label: 'Without approves', value: '' },
              { label: 'One of contributor', value: 'one-of-contributors' },
              { label: 'All contributors', value: 'all-contributors' },
            ]}
            value={
              column?.approveRule
                ? {
                    value: column.approveRule,
                    label: column.approveRule,
                  }
                : undefined
            }
            placeholder="Select one or all contributors"
          />
        </Field>
        <Field label="Danger zone" color="red">
          <ConfirmAction
            opener={
              <Button variant="solid" colorPalette="red">
                Delete column
              </Button>
            }
            text="Are you sure to delete column?"
            onOk={() => {
              runTransaction(
                () =>
                  deleteColumn({
                    columnId: column?.id as string,
                    contributorsIds: column?.contributors?.map((c) => c.id),
                  }),
                () => {
                  onClose();
                }
              );
            }}
          />
        </Field>
      </Fieldset.Root>
    </form>
  );
}

interface ColumnProps {
  column?: ColumnType;
  defaultEditable?: boolean;
  onDrag?: ({
    targetIndex,
    replaceToIndex,
    fromColumnId,
    toColumnId,
  }: {
    targetIndex: number;
    replaceToIndex: number;
    fromColumnId: string;
    toColumnId: string;
  }) => void;
  onDragTask?: (
    task: InstaQLEntity<AppSchema, 'tasks'>,
    targetColumn: ColumnType,
    currentColumnId?: string
  ) => void;
}

export function Column({ column, defaultEditable = false, onDrag, onDragTask }: ColumnProps) {
  const ref = useRef<HTMLDivElement>(null);
  const [isEdit, setEditMode] = useState(defaultEditable);
  const [isVisibleCreateTaskDialog, setCreateTaskDialogVisibility] = useState(defaultEditable);

  const [, columnDrop] = useDrop({
    accept: 'column',
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    hover(item: any, monitor) {
      if (!column) {
        return;
      }

      const dragIndex = item.index;
      const hoverIndex = column.position;
      if (dragIndex === hoverIndex) {
        return;
      }
      const hoverBoundingRect = ref.current!.getBoundingClientRect();
      const hoverMiddleX = (hoverBoundingRect.right - hoverBoundingRect.left) / 2;
      const clientOffset = monitor.getClientOffset();
      const hoverClientX = clientOffset!.x - hoverBoundingRect.left;

      if (dragIndex < hoverIndex && hoverClientX < hoverMiddleX) {
        return;
      }
      if (dragIndex > hoverIndex && hoverClientX > hoverMiddleX) {
        return;
      }

      onDrag?.({
        targetIndex: dragIndex,
        replaceToIndex: hoverIndex,
        fromColumnId: column.id as string,
        toColumnId: item.id,
      });

      item.index = hoverIndex;
    },
  });

  const [, drag] = useDrag({
    type: 'column',
    item: () => {
      return { id: column?.id, index: column?.position };
    },
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    collect: (monitor: any) => ({
      isDragging: monitor.isDragging(),
    }),
  });

  drag(columnDrop(ref));

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setEditMode(false);
  };

  return (
    <Box
      ml={4}
      bg="bg"
      shadow="md"
      borderRadius="md"
      my="4"
      minHeight="480px"
      w="380px"
      minW="380px"
      scrollBehavior="smooth"
      pb={4}
      key={column?.id}
      ref={ref}
    >
      <ColumnHeader
        column={column}
        isEdit={isEdit}
        onCreateTask={() => {
          setCreateTaskDialogVisibility(true);
        }}
        onEditClick={() => setEditMode(true)}
        onCloseEdit={() => setEditMode(false)}
      />

      {isEdit ? (
        <ColumnEdit column={column} onSubmit={handleSubmit} onClose={() => setEditMode(false)} />
      ) : (
        <ColumnTasks column={column} onDragTask={onDragTask} />
      )}

      <CreateTaskToColumnDialog
        isOpen={isVisibleCreateTaskDialog}
        onClose={() => setCreateTaskDialogVisibility(false)}
        columnId={column?.id as string}
      />
    </Box>
  );
}

async function createStatusAndUpdateColumn({
  name,
  teamId,
  columnId,
  creatorId,
}: {
  name: string;
  teamId: string;
  columnId: string;
  creatorId?: string;
}) {
  const statusId = id();
  return await db.transact([
    db.tx.statuses[statusId].update({
      updatedAt: new Date().toJSON(),
      name,
      teamId,
      createdAt: new Date().toJSON(),
      creatorId,
    }),
    db.tx.statuses[statusId].link({ teams: teamId }),
    db.tx.columns[columnId].update({ updatedAt: new Date().toJSON(), statusId }),
    db.tx.columns[columnId].link({ statuses: statusId }),
  ]);
}

async function updateColumnStatus({
  statusId,
  columnId,
}: {
  statusId: string;
  teamId: string;
  columnId: string;
}) {
  return await db.transact([
    db.tx.columns[columnId].update({ updatedAt: new Date().toJSON(), statusId }),
    db.tx.columns[columnId].link({ statuses: statusId }),
  ]);
}

async function updateColumnApproveRule({
  approveRule,
  columnId,
}: {
  approveRule: 'one-of-contributors' | 'all-contributors';
  columnId: string;
}) {
  return await db.transact([db.tx.columns[columnId].update({ updatedAt: new Date().toJSON(), approveRule })]);
}

async function updateContributors({
  userMemberships,
  columnId,
  teamId,
  creatorId,
}: {
  userMemberships: { userId: string; membershipId: string }[];
  columnId: string;
  teamId: string;
  creatorId: string;
}) {
  const contributorId = id();
  return await db.transact([
    ...userMemberships.map((mb) =>
      db.tx.contributors[contributorId]
        .update({
          updatedAt: new Date().toJSON(),
          membershipId: mb.membershipId,
          columnId,
          teamId,
          creatorId,
        })
        .link({ memberships: mb.membershipId })
        .link({ columns: columnId })
        .link({ teams: teamId })
    ),
  ]);
}

async function deleteContributors({ contributorsIds }: { contributorsIds: string[] }) {
  return await db.transact(contributorsIds.map((ci) => db.tx.contributors[ci].delete()));
}

async function deleteColumn({ columnId, contributorsIds }: { columnId: string; contributorsIds?: string[] }) {
  return await db.transact([
    db.tx.columns[columnId].delete(),
    ...(contributorsIds || []).map((ci) => db.tx.contributors[ci].delete()),
  ]);
}
