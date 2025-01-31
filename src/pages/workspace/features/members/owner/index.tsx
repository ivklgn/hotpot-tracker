import { useAction, useAtom } from '@reatom/npm-react';
import { fetchDeleteMembershipAtom, membersAtom } from './model';
import { Badge, Button, Stack, Table } from '@chakra-ui/react';
import { InviteMemberDialog } from './InviteMemberDialog';
import { ConfirmAction } from '../../../../../components/ConfirmAction';

export function OwnerMembers() {
  const [members] = useAtom(membersAtom);
  const fetchDeleteMembership = useAction(fetchDeleteMembershipAtom);

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
                      <Button variant="outline" size="xs" colorPalette="red">
                        Delete
                      </Button>
                    }
                    text="Are you sure you want to delete this user?"
                    onOk={() => {
                      fetchDeleteMembership(member.membershipId, member?.invite?.inviteId as string);
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
