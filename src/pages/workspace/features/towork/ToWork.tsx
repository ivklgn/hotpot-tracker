import * as RD from '@young-aviator-club/remote-data';
import { Badge, Box, Button, Table } from '@chakra-ui/react';
import { useAction, useAtom } from '@reatom/npm-react';
import { teamsAtom } from '../../../../features/account/model';
import { LuPlus } from 'react-icons/lu';
import { CreateTeamDialog } from '../../../../features/teams/CreateTeamDialog';
import { HiColorSwatch } from 'react-icons/hi';
import { EmptyState } from '../../../../components/ui/empty-state';
import { myInvitesAtom, fetchAcceptInviteAtom } from './model';
import { userAtom } from '../../../../features/auth/model';

export function ToWork() {
  const [user] = useAtom(userAtom);
  const fetchAcceptInvite = useAction(fetchAcceptInviteAtom);

  const [toWork] = useAtom(
    (ctx) => {
      let data: any[] = [];
      const teams = ctx.spy(teamsAtom);
      const myInvites = ctx.spy(myInvitesAtom);

      if (RD.isSuccess(myInvites) && myInvites.data.length > 0) {
        data = [
          ...data,
          ...myInvites.data.map((invite) => ({
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
                  fetchAcceptInvite({
                    membershipId: invite.membershipId,
                  });
                }}
              >
                Accept
              </Button>
            ),
          })),
        ];
      }

      if (RD.isSuccess(teams) && teams.data.length === 0) {
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
    },
    [teamsAtom]
  );

  console.log(toWork);

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
