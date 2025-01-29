import { id, tx } from '@instantdb/core';
import { db } from './instantdb';

// export async function createDrawingForTeam({ teamId, drawingName }: { teamId: string; drawingName: string }) {
//   const drawingId = id();

//   const result = await db.transact([
//     db.tx.drawings[drawingId].merge({ name: drawingName ?? 'Untitled' }),
//     db.tx.drawings[drawingId].link({ teams: teamId }),
//     db.tx.teams[teamId].link({ drawings: drawingId }),
//   ]);

//   return { result, vars: { drawingId } };
// }

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

export async function inviteMemberToTeam({
  teamId,
  userEmail,
  teamName,
}: {
  teamId: string;
  userEmail: string;
  teamName: string;
}) {
  const inviteId = id();

  const result = await db.transact([
    db.tx.invites[inviteId].update({ userEmail, teamId, teamName }),
    db.tx.invites[inviteId].link({ teams: teamId }),
  ]);

  return {
    result,
    vars: { inviteId },
  };
}

export async function acceptInvite({
  teamId,
  userEmail,
  userId,
}: {
  teamId: string;
  userEmail: string;
  userId: string;
}) {
  const membershipId = id();

  const result = await db.transact([
    db.tx.memberships[membershipId].update({ teamId, userId, userEmail }),
    db.tx.memberships[membershipId].link({ teams: teamId }),
  ]);

  return {
    result,
  };
}

export async function declineInvite({ inviteId }: { inviteId: string }) {
  const result = await db.transact([db.tx.invites[inviteId].merge({ status: 'declined' })]);

  return {
    result,
  };
}

export async function renameTeam({ teamId, newName }: { teamId: string; newName: string }) {
  const result = await db.transact([db.tx.teams[teamId].merge({ name: newName })]);

  return {
    result,
  };
}

export async function deleteTeam({ teamId }: { teamId: string }) {
  const result = await db.transact([db.tx.teams[teamId].delete()]);

  return {
    result,
  };
}
