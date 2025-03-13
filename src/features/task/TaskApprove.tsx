import { Button } from '@chakra-ui/react';
import { LuShieldCheck } from 'react-icons/lu';
import { db } from '../../instantdb';
import { AppSchema } from '../../../instant.schema';
import { id, InstaQLEntity } from '@instantdb/react';
import { UserAvatars } from '../../components/Avatars';
import { Tooltip } from '../../components/ui/tooltip';
import { useAccount } from '../account/AccountContext';
import { useCallback, useMemo } from 'react';
import { runMutation } from '../core/instantdb-mutation';

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
      console.error('Contributor not found');
      return;
    }

    if (isApproved) {
      const approveId = approvesData?.approves?.find((a) => a.contributorId === currentContributorId)?.id;
      if (!approveId) {
        console.error('Approval record not found');
        return;
      }
      runMutation(() => deleteApprove(approveId));
    } else {
      const approveId = id();
      runMutation(() =>
        db.transact([
          db.tx.approves[approveId].update({
            taskId: task?.id as string,
            teamId: currentTeamId as string,
            contributorId: currentContributorId,
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

  if (!task || !column || !column.approveRule || column.contributors.length === 0) {
    return null;
  }

  return (
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
  );
}

function deleteApprove(approveId: string) {
  return db.transact([db.tx.approves[approveId].delete()]);
}
