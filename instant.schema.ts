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
      creatorId: i.string().optional(),
      createdAt: i.date().optional(),
      updatedAt: i.date().optional(),
    }),
    memberships: i.entity({
      teamId: i.string(),
      userEmail: i.string(),
      userId: i.string().optional(), // TODO: required
      creatorId: i.string().optional(), // TODO: required
      createdAt: i.date().optional(), // TODO: required
      updatedAt: i.date().optional(),
    }),
    teams: i.entity({
      name: i.string(),
      creatorId: i.string().optional(),
      createdAt: i.date().optional(),
      updatedAt: i.date().optional(),
    }),
    boards: i.entity({
      name: i.string().indexed(),
      teamId: i.string(),
      creatorId: i.string().optional(),
      createdAt: i.date().indexed().optional(),
      deletedAt: i.date().indexed().optional(),
      updatedAt: i.date().indexed().optional(),
    }),
    columns: i.entity({
      boardId: i.string(),
      approveRule: i.string().optional(),
      teamId: i.string(),
      statusId: i.string().optional(),
      position: i.number().indexed(),
      creatorId: i.string().optional(),
      createdAt: i.date().indexed().optional(),
      updatedAt: i.date().optional(),
    }),
    statuses: i.entity({
      name: i.string(),
      teamId: i.string(),
      creatorId: i.string().optional(),
      createdAt: i.date().indexed().optional(),
      deletedAt: i.date().indexed().optional(), // TODO: required
      updatedAt: i.date().optional(),
    }),
    smartParams: i.entity({
      name: i.string(),
      type: i.string(),
      value: i.string(),
      boardId: i.string().optional(),
      taskId: i.string().optional(),
      teamId: i.string(),
      creatorId: i.string().optional(),
      createdAt: i.date().optional(),
      updatedAt: i.date().optional(),
    }),
    contributors: i.entity({
      columnId: i.string(),
      membershipId: i.string(),
      teamId: i.string(),
      creatorId: i.string().optional(),
      createdAt: i.date().optional(), // TODO: required
      updatedAt: i.date().optional(),
    }),
    approves: i.entity({
      taskId: i.string(),
      contributorId: i.string(),
      creatorId: i.string().optional(),
      teamId: i.string(),
      createdAt: i.date().optional(),
      updatedAt: i.date().optional(),
    }),
    tasks: i.entity({
      title: i.string().indexed(),
      content: i.json().optional(),
      teamId: i.string(),
      columnId: i.string(),
      boardId: i.string().optional(),
      creatorId: i.string().optional(),
      createdAt: i.date().indexed().optional(),
      deletedAt: i.date().indexed().optional(),
      updatedAt: i.date().indexed().optional(),
    }),
    events: i.entity({
      type: i.string(),
      payload: i.json(),
      teamId: i.string(),
      membershipId: i.string(),
      createdAt: i.date().indexed().optional(),
      updatedAt: i.date().optional(),
    }),
    issues: i.entity({
      taskId: i.string(),
      content: i.string(),
      teamId: i.string(),
      membershipId: i.string(),
      createdAt: i.date().indexed().optional(),
      creatorId: i.string().optional(),
      deletedAt: i.date().indexed().optional(),
    }),
    replies: i.entity({
      issueId: i.string(),
      content: i.string(),
      createdAt: i.date().indexed().optional(),
      membershipId: i.string(),
      teamId: i.string(),
      deletedAt: i.date().indexed().optional(),
      creatorId: i.string().optional(),
    }),
  },
  links: {
    // invites
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
    invitesMemberships: {
      forward: {
        on: 'invites',
        has: 'one',
        label: 'memberships',
        onDelete: 'cascade',
      },
      reverse: {
        on: 'memberships',
        has: 'many',
        label: 'invites',
      },
    },

    // events

    eventsTeams: {
      forward: {
        on: 'events',
        has: 'one',
        label: 'teams',
        onDelete: 'cascade',
      },
      reverse: {
        on: 'teams',
        has: 'many',
        label: 'events',
      },
    },
    eventsMemberships: {
      forward: {
        on: 'events',
        has: 'one',
        label: 'memberships',
        ondelete: 'cascade',
      },
      reverse: {
        on: 'memberships',
        has: 'many',
        label: 'events',
      },
    },

    // approves

    approvesTeams: {
      forward: {
        on: 'approves',
        has: 'one',
        label: 'teams',
        onDelete: 'cascade',
      },
      reverse: {
        on: 'teams',
        has: 'many',
        label: 'approves',
      },
    },
    approvesTasks: {
      forward: {
        on: 'approves',
        has: 'one',
        label: 'tasks',
        onDelete: 'cascade',
      },
      reverse: {
        on: 'tasks',
        has: 'many',
        label: 'approves',
      },
    },
    approvesContributors: {
      forward: {
        on: 'approves',
        has: 'one',
        label: 'contributors',
        onDelete: 'cascade',
      },
      reverse: {
        on: 'contributors',
        has: 'many',
        label: 'approves',
      },
    },

    // smartParams

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

    // tasks

    tasksColumns: {
      forward: {
        on: 'tasks',
        has: 'one',
        label: 'columns',
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
    tasksBoards: {
      forward: {
        on: 'tasks',
        has: 'one',
        label: 'boards',
      },
      reverse: {
        on: 'boards',
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

    issuesTasks: {
      forward: {
        on: 'issues',
        has: 'one',
        label: 'tasks',
        onDelete: 'cascade',
      },
      reverse: {
        on: 'tasks',
        has: 'many',
        label: 'issues',
      },
    },
    issuesTeams: {
      forward: {
        on: 'issues',
        has: 'one',
        label: 'teams',
        onDelete: 'cascade',
      },
      reverse: {
        on: 'teams',
        has: 'many',
        label: 'issues',
      },
    },
    issuesMemberships: {
      forward: {
        on: 'issues',
        has: 'one',
        label: 'memberships',
        onDelete: 'cascade',
      },
      reverse: {
        on: 'memberships',
        has: 'many',
        label: 'issues',
      },
    },

    repliesIssues: {
      forward: {
        on: 'replies',
        has: 'one',
        label: 'issues',
        onDelete: 'cascade',
      },
      reverse: {
        on: 'issues',
        has: 'many',
        label: 'replies',
      },
    },
    repliesTeams: {
      forward: {
        on: 'replies',
        has: 'one',
        label: 'teams',
        onDelete: 'cascade',
      },
      reverse: {
        on: 'teams',
        has: 'many',
        label: 'replies',
      },
    },
    repliesMemberships: {
      forward: {
        on: 'replies',
        has: 'one',
        label: 'memberships',
        onDelete: 'cascade',
      },
      reverse: {
        on: 'memberships',
        has: 'one',
        label: 'replies',
      },
    },
  },
});

type _AppSchema = typeof _schema;
type AppSchema = _AppSchema;
const schema: AppSchema = _schema;

export type { AppSchema };
export default schema;
