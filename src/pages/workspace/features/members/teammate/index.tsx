import { Table } from '@chakra-ui/react';
import { db } from '../../../../../instantdb';
import { useAccount } from '../../../../../features/account/AccountContext';

export function TeammateMembers() {
  const { user } = db.useAuth();
  const { currentTeamId } = useAccount();
  const { data: memberships } = db.useQuery({
    memberships: {
      invites: {},
      $: {
        where: {
          'teams.id': currentTeamId as string,
          userId: {
            $isNull: false,
          },
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
            <Table.ColumnHeader>Role</Table.ColumnHeader>
          </Table.Row>
        </Table.Header>
        <Table.Body>
          {memberships?.memberships?.map((member) => (
            <Table.Row key={member.userEmail}>
              <Table.Cell>{member.userEmail}</Table.Cell>
              <Table.Cell>{member.creatorId === member?.userId ? 'owner' : 'member'}</Table.Cell>
            </Table.Row>
          ))}
        </Table.Body>
      </Table.Root>
    </>
  );
}
