import { Badge, Box, Button, Table, Link as ChakraLink } from '@chakra-ui/react';
import { LuPlus } from 'react-icons/lu';
import { CreateTeamDialog } from '../../../../features/team/CreateTeamDialog';
import { HiColorSwatch } from 'react-icons/hi';
import { EmptyState } from '../../../../components/ui/empty-state';
import { db } from '../../../../instantdb';
import { useMemo, ReactNode } from 'react';
import { runTransaction } from '../../../../core/instantdb-transaction';
import { useAccount } from '../../../../features/account/AccountContext';
import { deleteEvent } from '../../../../features/events';
import { Link } from 'wouter';
import { toaster } from '../../../../utils/toaster';

interface ToWorkItem {
  message: ReactNode;
  action: ReactNode;
}

interface Event {
  id: string;
  type: string;
  payload?: {
    taskId?: string;
    taskTitle?: string;
    [key: string]: string | undefined;
  };
}

interface Invite {
  id: string;
  teamName: string;
  membershipId: string;
}

export function ToWork() {
  const { user } = db.useAuth();
  const { data: teams } = db.useQuery({ teams: {} });
  const { currentTeamId } = useAccount();

  const { data: membership } = db.useQuery(
    currentTeamId && user?.id
      ? {
          memberships: {
            $: {
              where: {
                userId: user.id,
              },
            },
          },
        }
      : null
  );

  const { data: events } = db.useQuery(
    currentTeamId && membership?.memberships?.length
      ? {
          events: {
            $: {
              where: {
                teamId: currentTeamId,
                membershipId: membership.memberships[0].id,
              },
            },
          },
        }
      : null
  );

  const { data: invites } = db.useQuery(
    user?.email
      ? {
          invites: {
            $: {
              where: {
                userEmail: user.email,
                status: 'pending',
              },
            },
          },
        }
      : null
  );

  const toWork = useMemo<ToWorkItem[]>(() => {
    const data: ToWorkItem[] = [];

    if (invites?.invites?.length) {
      const inviteItems = invites.invites.map((invite: Invite) => ({
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
              if (user?.id) {
                runTransaction(
                  () =>
                    acceptInvite({
                      inviteId: invite.id,
                      membershipId: invite.membershipId,
                      userId: user.id,
                    }),
                  () => {
                    toaster.create({
                      title: 'Invite accepted',
                      type: 'success',
                      action: {
                        label: 'Refresh page',
                        onClick: () => {
                          window.location.reload();
                        },
                      },
                    });
                  }
                );
                window.location.reload();
              }
            }}
          >
            Accept
          </Button>
        ),
      }));
      data.push(...inviteItems);
    }

    if (teams?.teams?.length === 0) {
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

    if (events?.events?.length) {
      events.events.forEach((event: Event) => {
        if (event.type === 'review-task') {
          data.push({
            message: (
              <>
                <Badge colorPalette="blue">review</Badge> You have a task{' '}
                <ChakraLink variant="underline" fontWeight="bold" asChild>
                  <Link to={`/task/${event.payload?.taskId}`}>{event.payload?.taskTitle}</Link>
                </ChakraLink>{' '}
                to review!
              </>
            ),
            action: (
              <Button
                size="xs"
                onClick={() => {
                  runTransaction(() => deleteEvent({ eventId: event.id }));
                }}
                variant="outline"
              >
                Mark as done
              </Button>
            ),
          });
        }
      });
    }

    return data;
  }, [invites?.invites, teams?.teams?.length, events?.events, user?.id]);

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
            <Table.Cell>{item.message}</Table.Cell>
            <Table.Cell textAlign="end">{item.action}</Table.Cell>
          </Table.Row>
        ))}
      </Table.Body>
    </Table.Root>
  );
}

async function acceptInvite({
  inviteId,
  membershipId,
  userId,
}: {
  inviteId: string;
  membershipId: string;
  userId: string;
}) {
  return db.transact([
    db.tx.invites[inviteId].update({ updatedAt: new Date().toJSON(), status: 'accepted' }),
    db.tx.memberships[membershipId].update({ updatedAt: new Date().toJSON(), userId }),
  ]);
}
