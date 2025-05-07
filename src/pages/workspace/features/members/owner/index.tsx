import { Badge, Button, Stack, Table } from '@chakra-ui/react';
import { InviteMemberDialog } from './InviteMemberDialog';
import { ConfirmAction } from '../../../../../components/ConfirmAction';
import { db } from '../../../../../instantdb';
import { useAccount } from '../../../../../features/account/AccountContext';
import { runTransaction } from '../../../../../core/instantdb-transaction';
import { toaster } from '../../../../../utils/toaster';

export function OwnerMembers() {
  const { currentTeamId } = useAccount();
  const { data: memberships } = db.useQuery({
    memberships: {
      invites: {},
      $: {
        where: {
          'teams.id': currentTeamId as string,
        },
      },
    },
  });

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
          {memberships?.memberships.map((member) => (
            <Table.Row key={member.userEmail}>
              <Table.Cell>
                {member.userEmail}{' '}
                {member.invites.length && member.invites.length > 0 ? (
                  <InviteStatus status={member.invites[0].status as 'pending' | 'accepted' | 'declined'} />
                ) : null}
              </Table.Cell>
              <Table.Cell>
                {!member.invites.length && member.creatorId === member.userId ? 'owner' : 'member'}
              </Table.Cell>
              <Table.Cell textAlign="end">
                {member.invites.length || (!member.invites.length && member.creatorId !== member.userId) ? (
                  <ConfirmAction
                    opener={
                      <Button variant="solid" size="xs" colorPalette="red">
                        Delete
                      </Button>
                    }
                    text="Are you sure you want to delete this user?"
                    onOk={() => {
                      runTransaction(
                        () =>
                          deleteMembership({
                            membershipId: member.id,
                          }),
                        () => {
                          toaster.create({
                            title: 'Team member deleted',
                            type: 'success',
                          });
                        }
                      );
                    }}
                  />
                ) : null}
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

async function deleteMembership({ membershipId }: { membershipId: string }) {
  return await db.transact([db.tx.memberships[membershipId].delete()]);
}
