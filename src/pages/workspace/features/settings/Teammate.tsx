import { Button, Table } from '@chakra-ui/react';
import { ConfirmAction } from '../../../../components/ConfirmAction';
import { useAccount } from '../../../../features/account/AccountContext';
import { db } from '../../../../instantdb';
import { useLocation } from 'wouter';
import { runTransaction } from '../../../../core/instantdb-transaction';
import { toaster } from '../../../../utils/toaster';

export function TeammateSettings() {
  const { setCurrentTeamId } = useAccount();
  const [, navigate] = useLocation();
  const { currentTeamId } = useAccount();
  const { user } = db.useAuth();
  const { data: memberships } = db.useQuery({
    memberships: {
      $: {
        where: {
          userId: user?.id as string,
          teamId: currentTeamId as string,
        },
      },
    },
  });
  const currentMembershipId = memberships?.memberships[0]?.id;

  const handleLeaveTeamClick = () => {
    runTransaction(
      () => leaveTeam({ membershipId: currentMembershipId as string }),
      () => {
        toaster.create({
          title: 'You are leaved',
          type: 'success',
        });
        setCurrentTeamId(undefined);
        navigate('/workspace', { replace: true });
      }
    );
  };

  return (
    <Table.Root size="md">
      <Table.Header>
        <Table.Row>
          <Table.ColumnHeader>Name</Table.ColumnHeader>
          <Table.ColumnHeader textAlign="end">Action</Table.ColumnHeader>
        </Table.Row>
      </Table.Header>
      <Table.Body>
        <Table.Row key="1">
          <Table.Cell color="red.600">Leave team</Table.Cell>
          <Table.Cell textAlign="end">
            <ConfirmAction
              opener={
                <Button variant="solid" size="xs" colorPalette="red">
                  Leave
                </Button>
              }
              text="Are you sure you want to leave this team?"
              onOk={handleLeaveTeamClick}
            />
          </Table.Cell>
        </Table.Row>
      </Table.Body>
    </Table.Root>
  );
}

async function leaveTeam({ membershipId }: { membershipId: string }) {
  return await db.transact([db.tx.memberships[membershipId].delete()]);
}
