import { id } from '@instantdb/core';
import { db } from './instantdb';

export async function createTeamWithMember({
  teamName,
  userEmail,
  userId,
}: {
  teamName: string;
  userEmail: string;
  userId: string;
}) {
  const teamId = id();
  const membershipId = id();

  const result = await db.transact([
    db.tx.teams[teamId].update({ name: teamName, creatorId: userId }),
    db.tx.memberships[membershipId].update({ teamId, userId, userEmail }),
    db.tx.memberships[membershipId].link({ teams: teamId }),
  ]);

  return {
    result,
    vars: {
      teamId,
      membershipId,
    },
  };
}
