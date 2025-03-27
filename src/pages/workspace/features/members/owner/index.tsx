import { Badge, Button, Stack, Table } from '@chakra-ui/react';
import { InviteMemberDialog } from './InviteMemberDialog';
import { ConfirmAction } from '../../../../../components/ConfirmAction';
import { db } from '../../../../../instantdb';
import { useAccount } from '../../../../../features/account/AccountContext';
import { useMemo } from 'react';
import { runTransaction } from '../../../../../core/instantdb-transaction';

export function OwnerMembers() {
  const { currentTeamId } = useAccount();
  const { data: memberships } = db.useQuery({
    memberships: {
      $: {
        where: {
          'teams.id': currentTeamId as string,
        },
      },
    },
  });
  const { data: invites } = db.useQuery({
    invites: {},
  });

  const members = useMemo(() => {
    if (memberships && invites) {
      const userEmailAsInviteStatus = invites.invites.reduce(
        (acc, invite) => {
          acc[invite.userEmail] = {
            inviteId: invite.id,
            status: invite.status as 'pending' | 'accepted' | 'declined',
          } as const;
          return acc;
        },
        {} as Record<string, { inviteId: string; status: 'pending' | 'accepted' | 'declined' }>
      );

      return memberships.memberships.map((membership) => ({
        membershipId: membership.id,
        userEmail: membership.userEmail,
        userId: membership.userId,
        invite: userEmailAsInviteStatus[membership.userEmail],
      }));
    }

    return [];
  }, [invites, memberships]);

  return (
    <>
      <Table.Root size="md">
        <Table.Header>
          <Table.Row>
            <Table.ColumnHeader>Email</Table.ColumnHeader>
            <Table.ColumnHeader>Status</Table.ColumnHeader>
            <Table.ColumnHeader textAlign="end">Action</Table.ColumnHeader>
          </Table.Row>
        </Table.Header>
        <Table.Body>
          {members.map((member) => (
            <Table.Row key={member.userEmail}>
              <Table.Cell>{member.userEmail}</Table.Cell>
              <Table.Cell>
                {member.invite ? <InviteStatus status={member?.invite?.status} /> : 'owner'}
              </Table.Cell>
              <Table.Cell textAlign="end">
                {member.invite && (
                  <ConfirmAction
                    opener={
                      <Button variant="solid" size="xs" colorPalette="red">
                        Delete
                      </Button>
                    }
                    text="Are you sure you want to delete this user?"
                    onOk={() => {
                      runTransaction(() =>
                        deleteMembership({
                          membershipId: member.membershipId,
                          inviteId: member?.invite?.inviteId as string,
                        })
                      );
                    }}
                  />
                )}
              </Table.Cell>
            </Table.Row>
          ))}
        </Table.Body>
      </Table.Root>

      <br />

      <Stack direction="row" h="10">
        <InviteMemberDialog opener={<Button size="xs">Invite</Button>} />
      </Stack>
    </>
  );
}

function InviteStatus({ status }: { status: 'pending' | 'accepted' | 'declined' }) {
  if (status === 'pending') {
    return <Badge colorPalette="yellow">pending</Badge>;
  }

  if (status === 'accepted') {
    return <Badge colorPalette="green">accepted</Badge>;
  }

  return <Badge colorPalette="red">declined</Badge>;
}

async function deleteMembership({ membershipId, inviteId }: { membershipId: string; inviteId: string }) {
  return await db.transact([db.tx.invites[inviteId].delete(), db.tx.memberships[membershipId].delete()]);
}
