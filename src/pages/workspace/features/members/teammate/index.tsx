import { useAtom } from '@reatom/npm-react';
import { Table } from '@chakra-ui/react';
import { teammateMembershipsSubscription } from './model';

export function TeammateMembers() {
  const [memberships] = useAtom(teammateMembershipsSubscription.dataAtom);

  return (
    <>
      <Table.Root size="md">
        <Table.Header>
          <Table.Row>
            <Table.ColumnHeader>Email</Table.ColumnHeader>
          </Table.Row>
        </Table.Header>
        <Table.Body>
          {memberships?.memberships?.map((member) => (
            <Table.Row key={member.userEmail}>
              <Table.Cell>{member.userEmail}</Table.Cell>
            </Table.Row>
          ))}
        </Table.Body>
      </Table.Root>
    </>
  );
}
