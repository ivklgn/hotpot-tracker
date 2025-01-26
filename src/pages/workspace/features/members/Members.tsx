import { useAtom } from '@reatom/npm-react';
import { invitesAtom, membershipsAtom } from './model';
import { Button, Stack, Table } from '@chakra-ui/react';
import * as RD from '@young-aviator-club/remote-data';
import { userAtom } from '../../../../features/auth/model';
import { InviteMemberDialog } from './InviteMemberDialog';

export function Members() {
  const [user] = useAtom(userAtom);

  const [members] = useAtom(
    (ctx) => {
      return RD.successOrElse([ctx.spy(membershipsAtom), ctx.spy(invitesAtom)], () => [] as any[])
        .flat()
        .map((memberOrInvite) => ({
          userEmail: memberOrInvite.userEmail,
          userId: memberOrInvite.userId,
          status: memberOrInvite.status ?? 'accepted',
        }));
    },
    [membershipsAtom, invitesAtom]
  );

  return (
    <>
      <Stack direction="row" h="10">
        <InviteMemberDialog opener={<Button size="xs">Invite</Button>} />
      </Stack>
      <Table.Root size="sm">
        <Table.Header>
          <Table.Row>
            <Table.ColumnHeader>Email</Table.ColumnHeader>
            <Table.ColumnHeader textAlign="end">Status</Table.ColumnHeader>
          </Table.Row>
        </Table.Header>
        <Table.Body>
          {members.map((member) => (
            <Table.Row key={member.userEmail}>
              <Table.Cell>
                {member.userEmail} {member.userId === user?.id ? '(you)' : ''}
              </Table.Cell>
              <Table.Cell textAlign="end">{member.userId === user?.id ? '-' : member.status}</Table.Cell>
            </Table.Row>
          ))}
        </Table.Body>
      </Table.Root>
    </>
  );
}
