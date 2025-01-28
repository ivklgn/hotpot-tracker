import * as RD from '@young-aviator-club/remote-data';
import { useAtom } from '@reatom/npm-react';
import { teammateMembershipsAtom } from './model';
import { Table } from '@chakra-ui/react';

export function TeammateMembers() {
  const [members] = useAtom(teammateMembershipsAtom);

  return (
    <>
      <Table.Root size="md">
        <Table.Header>
          <Table.Row>
            <Table.ColumnHeader>Email</Table.ColumnHeader>
          </Table.Row>
        </Table.Header>
        <Table.Body>
          {RD.successOrElse(members, () => []).map((member) => (
            <Table.Row key={member.userEmail}>
              <Table.Cell>{member.userEmail}</Table.Cell>
            </Table.Row>
          ))}
        </Table.Body>
      </Table.Root>
    </>
  );
}
