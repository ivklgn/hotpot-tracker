import tariffLimits from './tariff-limits.json';

export default {
  teams: {
    bind: ['isCreator', 'auth.id == data.creatorId', 'isMember', "auth.id in data.ref('memberships.userId')"],
    allow: {
      view: 'isMember',
      create: `isCreator && size(data.ref('users.teams.id')) <= ${tariffLimits.free.max_teams_per_account}`,
      delete: 'isCreator',
      update: 'isCreator',
    },
  },
  invites: {
    bind: [
      'isMember',
      "auth.id in data.ref('teams.memberships.userId')",
      'isInvitee',
      'auth.email == data.userEmail',
    ],
    allow: {
      view: 'isInvitee || isMember',
      create: 'isMember',
      delete: 'isMember',
      update: 'isInvitee',
    },
  },
  boards: {
    bind: ['isMember', "auth.id in data.ref('teams.memberships.userId')"],
    allow: {
      view: 'isMember',
      create: `isMember && size(data.ref('teams.boards.id')) <= ${tariffLimits.free.max_boards_per_team}`,
      delete: 'isMember',
      update: 'isMember',
    },
  },
  columns: {
    bind: ['isMember', "auth.id in data.ref('teams.memberships.userId')"],
    allow: {
      view: 'isMember',
      create: `isMember && size(data.ref('boards.columns.id')) <= ${tariffLimits.free.max_columns_per_board}`,
      delete: 'isMember',
      update: 'isMember',
    },
  },
  tasks: {
    bind: ['isMember', "auth.id in data.ref('teams.memberships.userId')"],
    allow: {
      view: 'isMember',
      create: `isMember && size(data.ref('teams.tasks.id')) <= ${tariffLimits.free.max_tasks_per_team}`,
      delete: 'isMember',
      update: 'isMember',
    },
  },
  contributors: {
    bind: ['isMember', "auth.id in data.ref('teams.memberships.userId')"],
    allow: {
      view: 'isMember',
      create: 'isMember',
      delete: 'isMember',
      update: 'isMember',
    },
  },
  statuses: {
    bind: ['isMember', "auth.id in data.ref('teams.memberships.userId')"],
    allow: {
      view: 'isMember',
      create: 'isMember',
      delete: 'isMember',
      update: 'isMember',
    },
  },
  smartParams: {
    bind: ['isMember', "auth.id in data.ref('teams.memberships.userId')"],
    allow: {
      view: 'isMember',
      create: `isMember && data.boardId != null ? size(data.ref('boards.smartParams.id')) <= ${tariffLimits.free.max_smart_params} : size(data.ref('tasks.smartParams.id')) <= ${tariffLimits.free.max_smart_params}`,
      delete: 'isMember',
      update: 'isMember',
    },
  },
  memberships: {
    bind: [
      'isMember',
      "auth.id in data.ref('teams.memberships.userId')",
      'isInviteeOrCreator',
      "size(data.ref('teams.invites.id')) == 0 ? auth.id in data.ref('teams.creatorId') : auth.email in data.ref('teams.invites.userEmail')",
      'isUser',
      'auth.id == data.userId',
      'isCreator',
      "auth.id in data.ref('teams.creatorId')",
      'isInvitee',
      "auth.email in data.ref('teams.invites.userEmail')",
    ],
    allow: {
      view: 'isMember',
      create: `isCreator && size(data.ref('teams.memberships.id')) <= ${tariffLimits.free.max_members_per_team}`,
      delete: 'isCreator',
      update: 'isInvitee',
    },
  },
  approves: {
    bind: ['isMember', "auth.id in data.ref('teams.memberships.userId')"],
    allow: {
      view: 'isMember',
      create: 'isMember',
      delete: 'isMember',
      update: 'isMember',
    },
  },
  logs: {
    bind: ['isMember', "auth.id in data.ref('teams.memberships.userId')"],
    allow: {
      view: 'isMember',
      create: 'isMember',
      delete: 'isMember',
      update: 'isMember',
    },
  },
  issues: {
    bind: [
      'isMember',
      "auth.id in data.ref('teams.memberships.userId')",
      'isCreator',
      'auth.id == data.creatorId',
    ],
    allow: {
      view: 'isMember',
      create: `isMember && size(data.ref('tasks.issues.id')) <= ${tariffLimits.free.max_issues_per_tasks}`,
      delete: 'isCreator',
      update: 'isCreator',
    },
  },
  replies: {
    bind: [
      'isMember',
      "auth.id in data.ref('teams.memberships.userId')",
      'isCreator',
      'auth.id == data.creatorId',
    ],
    allow: {
      view: 'isMember',
      create: `isMember && size(data.ref('issues.replies.id')) <= ${tariffLimits.free.max_replies_per_issue}`,
      delete: 'isCreator',
      update: 'isCreator',
    },
  },
};
