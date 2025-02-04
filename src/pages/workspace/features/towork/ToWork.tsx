import { Badge, Box, Button, Table } from '@chakra-ui/react';
import { LuPlus } from 'react-icons/lu';
import { CreateTeamDialog } from '../../../../features/team/CreateTeamDialog';
import { HiColorSwatch } from 'react-icons/hi';
import { EmptyState } from '../../../../components/ui/empty-state';
import { db } from '../../../../instantdb';
import { useMemo } from 'react';

export function ToWork() {
  const { user } = db.useAuth();
  const { data: teams } = db.useQuery({ teams: {} });
  const { data: invites } = db.useQuery({
    invites: {
      $: {
        where: {
          userEmail: user?.email as string,
          status: 'pending',
        },
      },
    },
  });

  const toWork = useMemo(() => {
    // TODO:
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    let data: any[] = [];

    if (invites?.invites?.length && invites?.invites?.length > 0) {
      data = [
        ...data,
        ...(invites?.invites || []).map((invite) => ({
          message: (
            <>
              <Badge colorPalette="purple">invite</Badge> You have an invite to join{' '}
              <strong>{invite.teamName}</strong> team!
            </>
          ),
          action: (
            <Button
              size="xs"
              onClick={() => {
                acceptInvite({
                  inviteId: invite.id,
                  membershipId: invite.membershipId,
                  userId: user?.id as string,
                });
                window.location.reload();
              }}
            >
              Accept
            </Button>
          ),
        })),
      ];
    }

    if (teams?.teams?.length === 0) {
      data.push({
        message: 'You dont have own teams. Create now and start working!',
        action: (
          <CreateTeamDialog
            opener={
              <Button size="xs">
                <LuPlus /> Create team
              </Button>
            }
          />
        ),
      });
    }

    return data;
  }, [invites?.invites, teams?.teams?.length, user?.id]);

  if (toWork.length === 0) {
    return (
      <Box flex="1" pt={8} mx={6}>
        <EmptyState
          icon={<HiColorSwatch />}
          title="No notifications or work for now"
          description="In this section you will see notifications and work that you need to do"
        />
      </Box>
    );
  }

  return (
    <Table.Root size="md">
      <Table.Header>
        <Table.Row>
          <Table.ColumnHeader>Message</Table.ColumnHeader>
          <Table.ColumnHeader textAlign="end">Action</Table.ColumnHeader>
        </Table.Row>
      </Table.Header>
      <Table.Body>
        {toWork.map((item, index) => (
          <Table.Row key={index}>
            <Table.Cell key={item.message}>{item.message}</Table.Cell>
            <Table.Cell textAlign="end">{item.action}</Table.Cell>
          </Table.Row>
        ))}
      </Table.Body>
    </Table.Root>
  );
}

async function acceptInvite({
  inviteId,
  membershipId,
  userId,
}: {
  inviteId: string;
  membershipId: string;
  userId: string;
}) {
  return db.transact([
    db.tx.invites[inviteId].update({ status: 'accepted' }),
    db.tx.memberships[membershipId].update({ userId }),
  ]);
}
