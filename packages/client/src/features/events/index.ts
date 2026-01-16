import { id } from '@instantdb/react';
import { db } from '../../instantdb';
import type { DBTransaction } from '@/@types/instantdb';

// TODO: map types for events
type EventType = 'review-task';

export async function createEvent({
  type,
  payload,
  teamId,
  membershipId,
}: {
  type: EventType;
  payload?: Record<string, string>;
  teamId: string;
  membershipId: string;
}): Promise<void> {
  const eventId = id();

  const transactions: DBTransaction[] = [
    db.tx.events[eventId].update({
      updatedAt: new Date().toJSON(),
      type,
      payload,
      teamId,
      membershipId,
      createdAt: new Date().toJSON(),
    }),
    db.tx.events[eventId].link({ teams: teamId }),
    db.tx.memberships[membershipId].link({ events: eventId }),
  ];

  await db.transact(transactions);
}

export async function deleteEvent({ eventId }: { eventId: string }): Promise<void> {
  await db.transact([db.tx.events[eventId].delete()]);
}
