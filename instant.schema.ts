import { i } from '@instantdb/core';

const _schema = i.schema({
  entities: {
    $users: i.entity({
      email: i.string().unique().indexed(),
    }),
    invites: i.entity({
      teamId: i.string(),
      membershipId: i.string(),
      teamName: i.string(),
      userEmail: i.string(),
      status: i.string(),
    }),
    memberships: i.entity({
      teamId: i.string(),
      userEmail: i.string(),
      userId: i.string(),
    }),
    teams: i.entity({
      creatorId: i.string(),
      name: i.string(),
    }),
  },
  links: {
    invitesTeams: {
      forward: {
        on: 'invites',
        has: 'one',
        label: 'teams',
        onDelete: 'cascade',
      },
      reverse: {
        on: 'teams',
        has: 'many',
        label: 'invites',
      },
    },
    membershipsTeams: {
      forward: {
        on: 'memberships',
        has: 'one',
        label: 'teams',
      },
      reverse: {
        on: 'teams',
        has: 'many',
        label: 'memberships',
      },
    },
  },
});

// This helps Typescript display better intellisense
type _AppSchema = typeof _schema;
type AppSchema = _AppSchema;
const schema: AppSchema = _schema;

export type { AppSchema };
export default schema;
