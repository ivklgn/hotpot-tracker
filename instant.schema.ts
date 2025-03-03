import { i } from '@instantdb/react';

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
      createdAt: i.date(),
    }),
    memberships: i.entity({
      teamId: i.string(),
      userEmail: i.string(),
      userId: i.string(),
      createdAt: i.date(),
    }),
    teams: i.entity({
      creatorId: i.string(),
      name: i.string(),
      createdAt: i.date(),
    }),
    boards: i.entity({
      name: i.string(),
      teamId: i.string(),
      createdAt: i.date().indexed(),
      deletedAt: i.date().indexed(),
    }),
    columns: i.entity({
      boardId: i.string(),
      approveRule: i.string(),
      teamId: i.string(),
      statusId: i.string(),
      position: i.number().indexed(),
      createdAt: i.date().indexed(),
    }),
    statuses: i.entity({
      name: i.string(),
      teamId: i.string(),
      createdAt: i.date().indexed(),
      deletedAt: i.date().indexed(),
    }),
    smartParams: i.entity({
      name: i.string(),
      type: i.string(),
      value: i.string(),
      boardId: i.string(),
      taskId: i.string(),
      createdAt: i.date(),
      teamId: i.string(),
    }),
    contributors: i.entity({
      columnId: i.string(),
      membershipId: i.string(),
      teamId: i.string(),
      createdAt: i.date(),
    }),
    tasks: i.entity({
      title: i.string(),
      content: i.json(),
      teamId: i.string(),
      columnId: i.string(),
      createdAt: i.date().indexed(),
      deletedAt: i.date().indexed(),
    }),
  },
  links: {
    smartParamsBoards: {
      forward: {
        on: 'smartParams',
        has: 'one',
        label: 'boards',
        onDelete: 'cascade',
      },
      reverse: {
        on: 'boards',
        has: 'many',
        label: 'smartParams',
      },
    },
    smartParamsTasks: {
      forward: {
        on: 'smartParams',
        has: 'one',
        label: 'tasks',
        onDelete: 'cascade',
      },
      reverse: {
        on: 'tasks',
        has: 'many',
        label: 'smartParams',
      },
    },
    smartParamsTeams: {
      forward: {
        on: 'smartParams',
        has: 'one',
        label: 'teams',
        onDelete: 'cascade',
      },
      reverse: {
        on: 'teams',
        has: 'many',
        label: 'smartParams',
      },
    },
    tasksColumns: {
      forward: {
        on: 'tasks',
        has: 'one',
        label: 'columns',
        onDelete: 'cascade',
      },
      reverse: {
        on: 'columns',
        has: 'many',
        label: 'tasks',
      },
    },
    tasksTeams: {
      forward: {
        on: 'tasks',
        has: 'one',
        label: 'teams',
        onDelete: 'cascade',
      },
      reverse: {
        on: 'teams',
        has: 'many',
        label: 'tasks',
      },
    },
    contributorsMemberships: {
      forward: {
        on: 'contributors',
        has: 'one',
        label: 'memberships',
        onDelete: 'cascade',
      },
      reverse: {
        on: 'memberships',
        has: 'many',
        label: 'contributors',
      },
    },
    columnContributors: {
      forward: {
        on: 'columns',
        has: 'many',
        label: 'contributors',
      },
      reverse: {
        on: 'contributors',
        has: 'many',
        label: 'columns',
      },
    },
    contributorsTeams: {
      forward: {
        on: 'contributors',
        has: 'one',
        label: 'teams',
        onDelete: 'cascade',
      },
      reverse: {
        on: 'teams',
        has: 'many',
        label: 'contributors',
      },
    },
    columnsStatuses: {
      forward: {
        on: 'columns',
        has: 'one',
        label: 'statuses',
      },
      reverse: {
        on: 'statuses',
        has: 'many',
        label: 'columns',
      },
    },
    columnsBoards: {
      forward: {
        on: 'columns',
        has: 'one',
        label: 'boards',
        onDelete: 'cascade',
      },
      reverse: {
        on: 'boards',
        has: 'many',
        label: 'columns',
      },
    },
    columnsTeams: {
      forward: {
        on: 'columns',
        has: 'one',
        label: 'teams',
        onDelete: 'cascade',
      },
      reverse: {
        on: 'teams',
        has: 'many',
        label: 'columns',
      },
    },
    statusesTeams: {
      forward: {
        on: 'statuses',
        has: 'one',
        label: 'teams',
        onDelete: 'cascade',
      },
      reverse: {
        on: 'teams',
        has: 'many',
        label: 'statuses',
      },
    },
    boardsTeams: {
      forward: {
        on: 'boards',
        has: 'one',
        label: 'teams',
        onDelete: 'cascade',
      },
      reverse: {
        on: 'teams',
        has: 'many',
        label: 'boards',
      },
    },
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
        onDelete: 'cascade',
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
