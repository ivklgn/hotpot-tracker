import { useAtom } from '@reatom/npm-react';
import { Table } from '@chakra-ui/react';
import { currentTeamAtom } from '../../../../../features/account/model';
import { reatomInstantDBSubscription } from '../../../../../reatom-instantdb';

export function TeammateMembers() {
  const [currentTeam] = useAtom(currentTeamAtom);
  const [memberships] = useAtom(
    () =>
      reatomInstantDBSubscription({
        memberships: {
          $: {
            where: {
              'teams.id': currentTeam?.id as string,
              userId: {
                $isNull: false,
              },
            },
          },
        },
      }),
    []
  );
  const [members] = useAtom(memberships.dataAtom);

  return (
    <>
      <Table.Root size="md">
        <Table.Header>
          <Table.Row>
            <Table.ColumnHeader>Email</Table.ColumnHeader>
          </Table.Row>
        </Table.Header>
        <Table.Body>
          {members?.data?.memberships?.map((member) => (
            <Table.Row key={member.userEmail}>
              <Table.Cell>{member.userEmail}</Table.Cell>
            </Table.Row>
          ))}
        </Table.Body>
      </Table.Root>
    </>
  );
}
