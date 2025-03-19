import { id } from '@instantdb/react';
import { db } from '../../instantdb';

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
}) {
  const eventId = id();

  return await db.transact([
    db.tx.events[eventId].update({ type, payload, teamId, membershipId, createdAt: new Date().toJSON() }),
    db.tx.events[eventId].link({ teams: teamId }),
    db.tx.memberships[membershipId].link({ events: eventId }),
  ]);
}

export async function deleteEvent({ eventId }: { eventId: string }) {
  return await db.transact([db.tx.events[eventId].delete()]);
}
