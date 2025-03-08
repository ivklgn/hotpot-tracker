import { Button } from '@chakra-ui/react';
import { LuShieldCheck } from 'react-icons/lu';
import { db } from '../../instantdb';
import { AppSchema } from '../../../instant.schema';
import { id, InstaQLEntity } from '@instantdb/react';
import { UserAvatars } from '../../components/Avatars';
import { Tooltip } from '../../components/ui/tooltip';
import { useAccount } from '../account/AccountContext';
import { useCallback, useMemo } from 'react';

interface TaskApproveProps {
  task?: InstaQLEntity<AppSchema, 'tasks', { smartParams: {}; columns: {} }>;
}

export function TaskApprove({ task }: TaskApproveProps) {
  const { user } = db.useAuth();
  const { currentTeamId } = useAccount();
  const { data: columnsWithContributors, isLoading: isLoadingColumnsWithContributors } = db.useQuery(
    task?.id
      ? {
          columns: {
            contributors: {
              memberships: {},
            },
            $: {
              where: {
                id: task.columnId,
              },
            },
          },
        }
      : null
  );

  const { data: approves, isLoading: isLoadingApproves } = db.useQuery(
    task?.id
      ? {
          approves: {
            $: {
              where: {
                taskId: task.id,
              },
            },
          },
        }
      : null
  );

  const isLoading = useMemo(
    () => isLoadingColumnsWithContributors || isLoadingApproves,
    [isLoadingColumnsWithContributors, isLoadingApproves]
  );

  const isAllowApprove = useMemo(() => {
    const currentContributorId = columnsWithContributors?.columns?.[0]?.contributors?.find(
      (c) => c.memberships?.userId === user?.id
    )?.id;
    return !!currentContributorId;
  }, [columnsWithContributors, user]);

  const isApproveButtonDisabled = useMemo(() => isLoading || !isAllowApprove, [isLoading, isAllowApprove]);

  const isApproved = useMemo(() => {
    const currentContributorId = columnsWithContributors?.columns?.[0]?.contributors?.find(
      (c) => c.memberships?.userId === user?.id
    )?.id;
    // @ts-ignore
    return (
      !!currentContributorId && approves?.approves?.find((a) => a?.contributorId === currentContributorId)
    );
  }, [approves, columnsWithContributors, user]);

  const handleToggleApproveClick = useCallback(() => {
    const currentContributorId = columnsWithContributors?.columns?.[0]?.contributors?.find(
      (c) => c.memberships?.userId === user?.id
    )?.id;

    if (!currentContributorId) {
      // TODO: possible?
      console.error('contributor not found');
      return;
    }

    if (!isApproved) {
      approveTask({
        taskId: task?.id as string,
        teamId: currentTeamId as string,
        contributorId: currentContributorId,
      });
    } else {
      const approveId = approves?.approves?.find((a) => a?.contributorId === currentContributorId)?.id;
      if (!approveId) {
        // TODO: possible?
        console.error('approve not found');
        return;
      }
      revokeApprove({ approveId });
    }
  }, [approves?.approves, columnsWithContributors?.columns, currentTeamId, isApproved, task?.id, user?.id]);

  if (
    !task ||
    columnsWithContributors?.columns?.length === 0 ||
    !columnsWithContributors?.columns?.[0]?.approveRule ||
    columnsWithContributors?.columns?.[0]?.contributors.length === 0
  ) {
    return null;
  }

  console.log({
    approves,
    contributors: columnsWithContributors?.columns?.[0]?.contributors,
    isAllowApprove,
    isApproved,
  });

  const alreadyApprovedUsers = approves?.approves?.map((a) => a?.contributorId);

  return (
    <Tooltip showArrow content="Wait appove">
      <Button
        variant="outline"
        colorPalette={!isApproved ? 'green' : 'red'}
        onClick={handleToggleApproveClick}
        loading={isLoading}
        disabled={isApproveButtonDisabled}
      >
        <UserAvatars
          users={columnsWithContributors?.columns?.[0]?.contributors
            ?.filter((c) => alreadyApprovedUsers?.includes(c.id))
            .map((c) => ({
              userId: c.memberships?.userId as string,
              userEmail: c.memberships?.userEmail as string,
            }))}
          size="2xs"
        />
        <LuShieldCheck />
        {!isAllowApprove ? 'Approve' : !isApproved ? 'Approve' : 'Revoke approve'}
      </Button>
    </Tooltip>
  );
}

async function approveTask({
  taskId,
  teamId,
  contributorId,
}: {
  taskId: string;
  teamId: string;
  contributorId: string;
}) {
  const approveId = id();
  return await db.transact([
    db.tx.approves[approveId].update({
      taskId,
      teamId,
      contributorId,
      createdAt: JSON.stringify(new Date()),
    }),
    db.tx.approves[approveId].link({ teams: teamId, tasks: taskId, contributors: contributorId }),
  ]);
}

async function revokeApprove({ approveId }: { approveId: string }) {
  return await db.transact([db.tx.approves[approveId].delete()]);
}
