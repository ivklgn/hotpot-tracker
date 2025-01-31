import { useAtom } from '@reatom/npm-react';
import { Table } from '@chakra-ui/react';
import { membershipsSubscription } from './model';

export function TeammateMembers() {
  const [memberships] = useAtom(membershipsSubscription.dataAtom);

  return (
    <>
      <Table.Root size="md">
        <Table.Header>
          <Table.Row>
            <Table.ColumnHeader>Email</Table.ColumnHeader>
          </Table.Row>
        </Table.Header>
        <Table.Body>
          {memberships?.data?.memberships?.map((member) => (
            <Table.Row key={member.userEmail}>
              <Table.Cell>{member.userEmail}</Table.Cell>
            </Table.Row>
          ))}
        </Table.Body>
      </Table.Root>
    </>
  );
}
