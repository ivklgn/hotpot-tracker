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
      creatorId: i.string(),
      createdAt: i.date(),
      updatedAt: i.date(),
    }),
    memberships: i.entity({
      teamId: i.string(),
      userEmail: i.string(),
      userId: i.string(),
      creatorId: i.string(),
      createdAt: i.date(),
      updatedAt: i.date(),
    }),
    teams: i.entity({
      name: i.string(),
      creatorId: i.string(),
      createdAt: i.date(),
      updatedAt: i.date(),
    }),
    boards: i.entity({
      name: i.string().indexed(),
      teamId: i.string(),
      creatorId: i.string(),
      createdAt: i.date().indexed(),
      deletedAt: i.date().indexed(),
      updatedAt: i.date().indexed(),
    }),
    columns: i.entity({
      boardId: i.string(),
      approveRule: i.string(),
      teamId: i.string(),
      statusId: i.string(),
      position: i.number().indexed(),
      creatorId: i.string(),
      createdAt: i.date().indexed(),
      updatedAt: i.date(),
    }),
    statuses: i.entity({
      name: i.string(),
      teamId: i.string(),
      creatorId: i.string(),
      createdAt: i.date().indexed(),
      deletedAt: i.date().indexed(),
      updatedAt: i.date(),
    }),
    smartParams: i.entity({
      name: i.string(),
      type: i.string(),
      value: i.string(),
      boardId: i.string(),
      taskId: i.string(),
      teamId: i.string(),
      creatorId: i.string(),
      createdAt: i.date(),
      updatedAt: i.date(),
    }),
    contributors: i.entity({
      columnId: i.string(),
      membershipId: i.string(),
      teamId: i.string(),
      creatorId: i.string(),
      createdAt: i.date(),
      updatedAt: i.date(),
    }),
    approves: i.entity({
      taskId: i.string(),
      contributorId: i.string(),
      creatorId: i.string(),
      teamId: i.string(),
      createdAt: i.date(),
      updatedAt: i.date(),
    }),
    tasks: i.entity({
      title: i.string().indexed(),
      content: i.json(),
      teamId: i.string(),
      columnId: i.string(),
      creatorId: i.string(),
      createdAt: i.date().indexed(),
      deletedAt: i.date().indexed(),
      updatedAt: i.date().indexed(),
    }),
    events: i.entity({
      type: i.string(),
      payload: i.json(),
      teamId: i.string(),
      membershipId: i.string(),
      createdAt: i.date().indexed(),
      updatedAt: i.date(),
    }),
    issues: i.entity({
      taskId: i.string(),
      content: i.string(),
      teamId: i.string(),
      membershipId: i.string(),
      createdAt: i.date().indexed(),
      creatorId: i.string(),
      deletedAt: i.date().indexed(),
    }),
    replies: i.entity({
      issueId: i.string(),
      content: i.string(),
      createdAt: i.date().indexed(),
      membershipId: i.string(),
      teamId: i.string(),
      deletedAt: i.date().indexed(),
      creatorId: i.string(),
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
    teamsUsers: {
      forward: {
        on: 'teams',
        has: 'one',
        label: 'users',
        onDelete: 'cascade',
      },
      reverse: {
        on: '$users',
        has: 'many',
        label: 'teams',
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
