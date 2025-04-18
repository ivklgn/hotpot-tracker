import { Badge, Button, Group } from '@chakra-ui/react';
import { LuShieldCheck } from 'react-icons/lu';
import { db } from '../../instantdb';
import { AppSchema } from '../../../instant.schema';
import { id, InstaQLEntity } from '@instantdb/react';
import { UserAvatars } from '../../components/Avatars';
import { Tooltip } from '../../components/ui/tooltip';
import { useAccount } from '../account/AccountContext';
import { useCallback, useMemo } from 'react';
import { runTransaction } from '../../core/instantdb-transaction';
import { taskErrorContext } from './errors';

const taskApproveError = taskErrorContext.feature('TaskApprove');

interface TaskApproveProps {
  task?: InstaQLEntity<AppSchema, 'tasks'>;
}

export function TaskApprove({ task }: TaskApproveProps) {
  const { user } = db.useAuth();
  const { currentTeamId } = useAccount();

  const { data: columnData, isLoading: isLoadingColumns } = db.useQuery(
    task?.id
      ? {
          columns: {
            statuses: {},
            contributors: {
              memberships: {},
            },
            $: {
              where: { id: task.columnId },
            },
          },
        }
      : null
  );

  const { data: approvesData, isLoading: isLoadingApproves } = db.useQuery(
    task?.id
      ? {
          approves: {
            $: {
              where: { taskId: task.id },
            },
          },
        }
      : null
  );

  const isLoading = isLoadingColumns || isLoadingApproves;
  const column = columnData?.columns?.[0];

  const currentContributorId = useMemo(
    () => column?.contributors?.find((c) => c.memberships?.userId === user?.id)?.id,
    [column, user]
  );

  const alreadyApprovedSet = useMemo(
    () => new Set(approvesData?.approves?.map((a) => a.contributorId)),
    [approvesData]
  );

  const isAllowApprove = !!currentContributorId;
  const isApproved = !!currentContributorId && alreadyApprovedSet.has(currentContributorId);
  const isButtonDisabled = isLoading || !isAllowApprove;

  const handleToggleApproveClick = useCallback(() => {
    if (!currentContributorId) {
      taskApproveError('UnexpectedError', 'Contributor not found').emit();
      return;
    }

    if (isApproved) {
      const approveId = approvesData?.approves?.find((a) => a.contributorId === currentContributorId)?.id;
      if (!approveId) {
        taskApproveError('UnexpectedError', 'Approve not found').emit();
        return;
      }
      runTransaction(() => deleteApprove(approveId));
    } else {
      const approveId = id();
      runTransaction(() =>
        db.transact([
          db.tx.approves[approveId].update({
            updatedAt: new Date().toJSON(),
            taskId: task?.id as string,
            teamId: currentTeamId as string,
            contributorId: currentContributorId,
            creatorId: user?.id as string,
            createdAt: new Date().toISOString(),
          }),
          db.tx.approves[approveId].link({
            teams: currentTeamId,
            tasks: task?.id,
            contributors: currentContributorId,
          }),
        ])
      );
    }
  }, [approvesData, currentContributorId, isApproved, task?.id, currentTeamId]);

  if (!task || !column) {
    return null;
  }

  return (
    <>
      {column.statuses && (
        <Group attached>
          <Badge variant="outline" height="32px">
            Status
          </Badge>
          <Badge variant="outline" height="32px">
            {column.statuses.name}
          </Badge>
        </Group>
      )}
      {column.approveRule && column.contributors.length > 0 && (
        <Tooltip showArrow content="Wait approve">
          <Button
            variant="outline"
            colorPalette={isApproved ? 'red' : 'green'}
            onClick={handleToggleApproveClick}
            loading={isLoading}
            disabled={isButtonDisabled}
          >
            <UserAvatars
              users={column.contributors
                ?.filter((c) => alreadyApprovedSet.has(c.id))
                ?.map((c) => ({
                  userId: c?.memberships?.userId as string,
                  userEmail: c?.memberships?.userEmail as string,
                }))}
              size="2xs"
            />
            <LuShieldCheck />
            {isApproved ? 'Revoke Approve' : 'Approve'}
          </Button>
        </Tooltip>
      )}
    </>
  );
}

function deleteApprove(approveId: string) {
  return db.transact([db.tx.approves[approveId].delete()]);
}
